import { DEFAULT_CURRENCY } from '@app/common/constants/constant';
import { CommandType, CommonStatus, FutureCommandType } from '@app/common/enums/status.enum';
import { USDT2CoinName } from '@app/common/helpers/common.helper';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CommandLogEntity } from '../log/command-log/entities/command-log.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { IWallet } from '../wallet/wallet.interface';
import { CommandEntity } from './entities/command.entity';
import { FutureCommandEntity } from './entities/future-command.entity';

@Processor('binance:coin', { concurrency: 2 })
export class CommandProcessor extends WorkerHost {
	private logger = new Logger();

	constructor(
		private readonly entityManager: EntityManager,
		private readonly walletService: IWallet
	) {
		super();
	}

	async process(job: Job<any, any, string>): Promise<any> {
		switch (job.name) {
			case 'coinPrice':
				const data = await this.matchCommand(job.data);
				return data;

			default:
				throw new Error('No job name match');
		}
	}

	async matchCommand(data: Record<string, any>) {
		this.logger.log('Processing match command....');
		const matchSellData = await this.entityManager.getRepository(CommandEntity).find({
			where: {
				type: CommandType.SELL,
				coinName: USDT2CoinName(data.s),
				expectPrice: LessThanOrEqual(data.p)
			}
		});

		await this.handleSell(matchSellData);

		const matchSellLostStopData = await this.entityManager.getRepository(CommandEntity).find({
			where: {
				type: CommandType.SELL,
				coinName: USDT2CoinName(data.s),
				lossStopPrice: MoreThanOrEqual(data.p)
			}
		});

		await this.handleSell(matchSellLostStopData, true);

		const matchBuyData = await this.entityManager.getRepository(CommandEntity).find({
			where: {
				type: CommandType.BUY,
				coinName: USDT2CoinName(data.s),
				expectPrice: MoreThanOrEqual(data.p)
			}
		});

		await this.handleBuy(matchBuyData);

		// FUTURE COMMAND
		// entry limit future command
		const activeCommands1 = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				type: FutureCommandType.LIMIT,
				isEntry: false,
				coinName: USDT2CoinName(data.s),
				lessThanEntryPrice: true,
				entryPrice: LessThanOrEqual(data.p)
			}
		});

		const activeCommands2 = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				type: FutureCommandType.LIMIT,
				isEntry: false,
				coinName: USDT2CoinName(data.s),
				lessThanEntryPrice: false,
				entryPrice: MoreThanOrEqual(data.p)
			}
		});

		const merge = [...activeCommands1, ...activeCommands2];

		if (merge.length > 0) {
			await this.entityManager.getRepository(FutureCommandEntity).update(
				[...activeCommands1, ...activeCommands2].map((x) => x.id),
				{ isEntry: true }
			);
		}

		// handle liquidation
		const liquidations = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				isEntry: true,
				coinName: USDT2CoinName(data.s)
			}
		});

		await this.handleLiquidation(liquidations, data.p);

		// handle win
		const winCommands = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				isEntry: true,
				coinName: USDT2CoinName(data.s),
				expectPrice: LessThanOrEqual(data.p)
			}
		});

		await this.handleFutureWin(winCommands);

		// handle lose
		const loseCommands = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				isEntry: true,
				coinName: USDT2CoinName(data.s),
				lossStopPrice: MoreThanOrEqual(data.p)
			}
		});

		await this.handleFutureLose(loseCommands, data.p);

		return;
	}

	async handleSell(data: Record<string, any>[], isLostStop = false) {
		for (const command of data) {
			await this.entityManager.transaction(async (trx) => {
				await trx.getRepository(CommandEntity).delete(command.id);

				const { id, createdAt, updatedAt, deletedAt, ...rest } = command;

				// add logs
				await trx.getRepository(CommandLogEntity).save({
					...rest,
					isLostStop,
					type: CommandType.SELL,
					status: CommonStatus.SUCCESS
				});

				return;
			});
		}

		return;
	}

	async handleBuy(data: Record<string, any>[]) {
		for (const command of data) {
			await this.entityManager.transaction(async (trx) => {
				await this.walletService.increase(
					trx,
					command.coinName,
					command.quantity,
					command.userId
				);

				await trx.getRepository(CommandEntity).delete(command.id);

				const { id, createdAt, updatedAt, deletedAt, ...rest } = command;
				// add logs
				await trx.getRepository(CommandLogEntity).save({
					...rest,
					type: CommandType.BUY,
					status: CommonStatus.SUCCESS
				});
			});
		}

		return;
	}

	async handleLiquidation(data: Record<string, any>[], price: number) {
		for (const command of data) {
			if (price < command.entryPrice) {
				await this.entityManager.transaction(async (trx) => {
					const usdt = await trx
						.getRepository(WalletEntity)
						.findOne({ where: { userId: command.userId, coinName: DEFAULT_CURRENCY } });

					const loseAmount =
						((command.entryPrice - price) / command.entryPrice) * command.quantity;

					if (usdt && loseAmount > usdt.quantity) {
						// reduce all usdt and delete command
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							usdt.quantity,
							command.userId
						);

						await trx.getRepository(FutureCommandEntity).delete(command.id);
						return;
					}

					if (loseAmount > command.quantity) {
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							loseAmount - command.quantity / command.leverage,
							command.userId
						);

						await trx.getRepository(FutureCommandEntity).delete(command.id);
						return;
					}
				});
			}
		}

		return;
	}

	async handleFutureWin(data: Record<string, any>[]) {
		for (const command of data) {
			const winAmount =
				((command.expectPrice - command.entryPrice) / command.expectPrice) *
					command.quantity +
				command.quantity / command.leverage;
			await this.entityManager.transaction(async (trx) => {
				await this.walletService.increase(trx, DEFAULT_CURRENCY, winAmount, command.userId);

				await trx.getRepository(FutureCommandEntity).delete(command.id);

				return;
			});
		}

		return;
	}

	async handleFutureLose(data: Record<string, any>[], price: number) {
		for (const command of data) {
			await this.entityManager.transaction(async (trx) => {
				const usdt = await trx
					.getRepository(WalletEntity)
					.findOne({ where: { userId: command.userId, coinName: DEFAULT_CURRENCY } });

				const loseAmount =
					((command.entryPrice - command.lossStopPrice) / command.entryPrice) *
					command.quantity;

				if (usdt && loseAmount > usdt.quantity) {
					// reduce all usdt and delete command
					await this.walletService.decrease(
						trx,
						DEFAULT_CURRENCY,
						usdt.quantity,
						command.userId
					);

					await trx.getRepository(FutureCommandEntity).delete(command.id);
					return;
				}

				await this.walletService.decrease(
					trx,
					DEFAULT_CURRENCY,
					((command.entryPrice - command.lossStopPrice) / command.entryPrice) *
						command.quantity -
						command.quantity / command.leverage,
					command.userId
				);

				await trx.getRepository(FutureCommandEntity).delete(command.id);
				return;
			});
		}

		return;
	}
}
