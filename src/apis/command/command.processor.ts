import { DEFAULT_CURRENCY } from '@app/common/constants/constant';
import {
	CommandType,
	CommonStatus,
	FutureCommandOrderType,
	FutureCommandType
} from '@app/common/enums/status.enum';
import { USDT2CoinName } from '@app/common/helpers/common.helper';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CommandLogEntity } from '../log/command-log/entities/command-log.entity';
import { FutureCommandLogEntity } from '../log/future-command-log/entities/future-command-log.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { IWallet } from '../wallet/wallet.interface';
import { CommandEntity } from './entities/command.entity';
import { FutureCommandEntity } from './entities/future-command.entity';
import { IFutureCommand } from './future-command.interface';

@Processor('binance:coin', { concurrency: 2 })
export class CommandProcessor extends WorkerHost {
	private logger = new Logger();

	constructor(
		private readonly entityManager: EntityManager,
		private readonly walletService: IWallet,
		private readonly futureCommandService: IFutureCommand
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
		const winCommands1 = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				isEntry: true,
				orderType: FutureCommandOrderType.LONG,
				coinName: USDT2CoinName(data.s),
				expectPrice: LessThanOrEqual(data.p)
			}
		});

		const winCommands2 = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				isEntry: true,
				orderType: FutureCommandOrderType.SHORT,
				coinName: USDT2CoinName(data.s),
				expectPrice: MoreThanOrEqual(data.p)
			}
		});

		await this.handleFutureWin([...winCommands1, ...winCommands2]);

		// handle lose
		const loseCommands1 = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				isEntry: true,
				orderType: FutureCommandOrderType.LONG,
				coinName: USDT2CoinName(data.s),
				lossStopPrice: MoreThanOrEqual(data.p)
			}
		});

		const loseCommands2 = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				isEntry: true,
				orderType: FutureCommandOrderType.SHORT,
				coinName: USDT2CoinName(data.s),
				lossStopPrice: LessThanOrEqual(data.p)
			}
		});

		await this.handleFutureLose([...loseCommands1, ...loseCommands2], data.p);

		return;
	}

	async handleSell(data: Record<string, any>[], isLostStop = false) {
		for (const command of data) {
			await this.entityManager.transaction(async (trx) => {
				await trx.getRepository(CommandEntity).delete(command.id);

				const { id, createdAt, updatedAt, deletedAt, ...rest } = command;

				await this.walletService.increase(
					trx,
					DEFAULT_CURRENCY,
					command.totalPay,
					command.userId
				);

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
			const { id, createdAt, updatedAt, deletedAt, lessThanEntryPrice, isEntry, ...rest } =
				command;
			if (command.orderType === FutureCommandOrderType.LONG && price < command.entryPrice) {
				await this.entityManager.transaction(async (trx) => {
					const usdt = await trx
						.getRepository(WalletEntity)
						.findOne({ where: { userId: command.userId, coinName: DEFAULT_CURRENCY } });

					const loseAmount = this.futureCommandService.calcAmount(
						command.entryPrice,
						price,
						command.quantity,
						command.leverage,
						true
					);

					if (usdt && loseAmount > usdt.quantity) {
						// reduce all usdt and delete command
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							usdt.quantity,
							command.userId
						);

						await trx.getRepository(FutureCommandEntity).delete(command.id);

						// add logs
						await trx.getRepository(FutureCommandLogEntity).save({
							...rest,
							status: CommonStatus.SUCCESS,
							desc: 'Liquidation'
						});
						return;
					}

					if (loseAmount + command.quantity / command.leverage > command.quantity) {
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							loseAmount,
							command.userId
						);

						await trx.getRepository(FutureCommandEntity).delete(command.id);

						// add logs
						await trx.getRepository(FutureCommandLogEntity).save({
							...rest,
							status: CommonStatus.SUCCESS,
							desc: 'Liquidation'
						});
						return;
					}
				});
			}

			if (command.orderType === FutureCommandOrderType.SHORT && price > command.entryPrice) {
				await this.entityManager.transaction(async (trx) => {
					const usdt = await trx
						.getRepository(WalletEntity)
						.findOne({ where: { userId: command.userId, coinName: DEFAULT_CURRENCY } });

					const loseAmount = this.futureCommandService.calcAmount(
						price,
						command.entryPrice,
						command.quantity,
						command.leverage,
						true
					);

					if (usdt && loseAmount > usdt.quantity) {
						// reduce all usdt and delete command
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							usdt.quantity,
							command.userId
						);

						await trx.getRepository(FutureCommandEntity).delete(command.id);

						// add logs
						await trx.getRepository(FutureCommandLogEntity).save({
							...rest,
							status: CommonStatus.SUCCESS,
							desc: 'Liquidation'
						});
						return;
					}

					if (loseAmount + command.quantity / command.leverage > command.quantity) {
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							loseAmount,
							command.userId
						);

						await trx.getRepository(FutureCommandEntity).delete(command.id);

						// add logs
						await trx.getRepository(FutureCommandLogEntity).save({
							...rest,
							status: CommonStatus.SUCCESS,
							desc: 'Liquidation'
						});
						return;
					}
				});
			}
		}

		return;
	}

	async handleFutureWin(data: Record<string, any>[]) {
		for (const command of data) {
			const { id, createdAt, updatedAt, deletedAt, lessThanEntryPrice, isEntry, ...rest } =
				command;
			if (command.orderType === FutureCommandOrderType.LONG) {
				const winAmount = this.futureCommandService.calcAmount(
					command.expectPrice,
					command.entryPrice,
					command.quantity,
					command.leverage,
					false
				);

				await this.entityManager.transaction(async (trx) => {
					await this.walletService.increase(
						trx,
						DEFAULT_CURRENCY,
						winAmount,
						command.userId
					);

					await trx.getRepository(FutureCommandEntity).delete(command.id);

					// add logs
					await trx.getRepository(FutureCommandLogEntity).save({
						...rest,
						status: CommonStatus.SUCCESS,
						desc: 'Win'
					});

					return;
				});
			}

			if (command.orderType === FutureCommandOrderType.SHORT) {
				const winAmount = this.futureCommandService.calcAmount(
					command.entryPrice,
					command.expectPrice,
					command.quantity,
					command.leverage,
					false
				);

				await this.entityManager.transaction(async (trx) => {
					await this.walletService.increase(
						trx,
						DEFAULT_CURRENCY,
						winAmount,
						command.userId
					);

					await trx.getRepository(FutureCommandEntity).delete(command.id);

					// add logs
					await trx.getRepository(FutureCommandLogEntity).save({
						...rest,
						status: CommonStatus.SUCCESS,
						desc: 'Win'
					});

					return;
				});
			}
		}

		return;
	}

	async handleFutureLose(data: Record<string, any>[], price: number) {
		for (const command of data) {
			const { id, createdAt, updatedAt, deletedAt, lessThanEntryPrice, isEntry, ...rest } =
				command;

			if (command.orderType === FutureCommandOrderType.LONG) {
				await this.entityManager.transaction(async (trx) => {
					const usdt = await trx
						.getRepository(WalletEntity)
						.findOne({ where: { userId: command.userId, coinName: DEFAULT_CURRENCY } });

					const loseAmount = this.futureCommandService.calcAmount(
						command.entryPrice,
						command.lossStopPrice,
						command.quantity,
						command.leverage,
						true
					);

					if (usdt && loseAmount > usdt.quantity) {
						// reduce all usdt and delete command
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							usdt.quantity,
							command.userId
						);

						await trx.getRepository(FutureCommandEntity).delete(command.id);
						// add logs
						await trx.getRepository(FutureCommandLogEntity).save({
							...rest,
							status: CommonStatus.SUCCESS,
							desc: 'Liquidation'
						});
						return;
					}

					await this.walletService.decrease(
						trx,
						DEFAULT_CURRENCY,
						loseAmount,
						command.userId
					);

					await trx.getRepository(FutureCommandEntity).delete(command.id);

					// add logs
					await trx.getRepository(FutureCommandLogEntity).save({
						...rest,
						status: CommonStatus.SUCCESS,
						desc: 'Lose'
					});
					return;
				});
			}

			if (command.orderType === FutureCommandOrderType.SHORT) {
				await this.entityManager.transaction(async (trx) => {
					const usdt = await trx
						.getRepository(WalletEntity)
						.findOne({ where: { userId: command.userId, coinName: DEFAULT_CURRENCY } });

					const loseAmount = this.futureCommandService.calcAmount(
						command.lossStopPrice,
						command.entryPrice,
						command.quantity,
						command.leverage,
						true
					);

					if (usdt && loseAmount > usdt.quantity) {
						// reduce all usdt and delete command
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							usdt.quantity,
							command.userId
						);

						await trx.getRepository(FutureCommandEntity).delete(command.id);

						// add logs
						await trx.getRepository(FutureCommandLogEntity).save({
							...rest,
							status: CommonStatus.SUCCESS,
							desc: 'Liquidation'
						});
						return;
					}

					await this.walletService.decrease(
						trx,
						DEFAULT_CURRENCY,
						loseAmount,
						command.userId
					);

					await trx.getRepository(FutureCommandEntity).delete(command.id);

					// add logs
					await trx.getRepository(FutureCommandLogEntity).save({
						...rest,
						status: CommonStatus.SUCCESS,
						desc: 'Lose'
					});
					return;
				});
			}
		}

		return;
	}
}
