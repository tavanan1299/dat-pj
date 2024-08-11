import { DEFAULT_CURRENCY, HistoryWalletType } from '@app/common/constants/constant';
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
import { INotification } from '../notification/notification.interface';
import { Notification_Type } from '../notification/types';
import { IWallet } from '../wallet/wallet.interface';
import { CommandEntity } from './entities/command.entity';
import { FutureCommandEntity } from './entities/future-command.entity';
import { IFutureCommand } from './future-command.interface';

@Processor('binance:coin', { concurrency: 2 })
export class CommandProcessor extends WorkerHost {
	private logger = new Logger();
	private DATA_NOTI: Notification_Type = {
		message: 'Executed command',
		entity: 'notification',
		entityKind: 'create',
		notiType: 'announcement'
	};

	constructor(
		private readonly entityManager: EntityManager,
		private readonly walletService: IWallet,
		private readonly futureCommandService: IFutureCommand,
		private readonly notifService: INotification
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

		// handle liquidation 80 percent
		const longLiquidations80 = await this.entityManager
			.getRepository(FutureCommandEntity)
			.find({
				where: {
					isEntry: true,
					orderType: FutureCommandOrderType.LONG,
					coinName: USDT2CoinName(data.s),
					liquidationPrice80: MoreThanOrEqual(data.p)
				}
			});

		const shortLiquidations80 = await this.entityManager
			.getRepository(FutureCommandEntity)
			.find({
				where: {
					isEntry: true,
					orderType: FutureCommandOrderType.SHORT,
					coinName: USDT2CoinName(data.s),
					liquidationPrice80: LessThanOrEqual(data.p)
				}
			});

		for (const futureCommand of [...longLiquidations80, ...shortLiquidations80]) {
			await this.notifService.sendNotification(this.DATA_NOTI, futureCommand.userId, {
				body: `Your future order has been reached 80 percent of liquidation`,
				...futureCommand,
				action: 'future'
			});
		}

		// handle liquidation
		const longLiquidations = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				isEntry: true,
				orderType: FutureCommandOrderType.LONG,
				coinName: USDT2CoinName(data.s),
				liquidationPrice: MoreThanOrEqual(data.p)
			}
		});

		const shortLiquidations = await this.entityManager.getRepository(FutureCommandEntity).find({
			where: {
				isEntry: true,
				orderType: FutureCommandOrderType.SHORT,
				coinName: USDT2CoinName(data.s),
				liquidationPrice: LessThanOrEqual(data.p)
			}
		});

		await this.handleLiquidation([...longLiquidations, ...shortLiquidations], data.p);

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

		await this.handleFutureWin([...winCommands1, ...winCommands2], data.p);

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
					command.userId,
					HistoryWalletType.SPOT_LIMIT
				);

				// add logs
				const commandLog = await trx.getRepository(CommandLogEntity).save({
					...rest,
					isLostStop,
					type: CommandType.SELL,
					status: CommonStatus.SUCCESS
				});

				await this.notifService.sendNotification(this.DATA_NOTI, command.userId, {
					body: `Your limit order has been reached the ${isLostStop ? 'LS' : 'TP'}`,
					...commandLog,
					action: 'limit'
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
					command.userId,
					HistoryWalletType.SPOT_LIMIT
				);

				await trx.getRepository(CommandEntity).delete(command.id);

				const { id, createdAt, updatedAt, deletedAt, ...rest } = command;
				// add logs
				const commandLog = await trx.getRepository(CommandLogEntity).save({
					...rest,
					type: CommandType.BUY,
					status: CommonStatus.SUCCESS
				});

				await this.notifService.sendNotification(this.DATA_NOTI, command.userId, {
					body: `Your limit order has been bought`,
					...commandLog,
					action: 'limit'
				});
			});
		}

		return;
	}

	async handleLiquidation(data: Record<string, any>[], price: string) {
		for (const command of data) {
			const { id, createdAt, updatedAt, deletedAt, lessThanEntryPrice, isEntry, ...rest } =
				command;
			const profit = this.futureCommandService.calcProfit(
				command.entryPrice,
				command.liquidationPrice,
				command.quantity,
				command.orderType === FutureCommandOrderType.LONG ? true : false
			);

			await this.entityManager.transaction(async (trx) => {
				const PNLClosed = command.quantity / command.leverage + profit;
				if (PNLClosed < 0) {
					await this.walletService.decrease(
						trx,
						DEFAULT_CURRENCY,
						Math.abs(PNLClosed),
						command.userId,
						HistoryWalletType.FUTURE
					);
				} else {
					await this.walletService.increase(
						trx,
						DEFAULT_CURRENCY,
						PNLClosed,
						command.userId,
						HistoryWalletType.FUTURE
					);
				}
				await trx.getRepository(FutureCommandEntity).delete(command.id);

				// add logs
				const futureCommandLog = await trx.getRepository(FutureCommandLogEntity).save({
					...rest,
					status: CommonStatus.SUCCESS,
					desc: 'Liquidation',
					PNLClosed: 0,
					closedVolume: command.entryPrice * command.leverage,
					closingPrice: +price,
					closedAt: new Date()
				});

				await this.notifService.sendNotification(this.DATA_NOTI, command.userId, {
					body: 'Your future order has been liquidated',
					...futureCommandLog,
					action: 'future'
				});
				return;
			});
		}

		return;
	}

	async handleFutureWin(data: Record<string, any>[], price: string) {
		for (const command of data) {
			const { id, createdAt, updatedAt, deletedAt, lessThanEntryPrice, isEntry, ...rest } =
				command;
			const profit = this.futureCommandService.calcProfit(
				command.entryPrice,
				command.expectPrice,
				command.quantity,
				command.orderType === FutureCommandOrderType.LONG ? true : false
			);

			await this.entityManager.transaction(async (trx) => {
				const PNLClosed = command.quantity / command.leverage + profit;
				await this.walletService.increase(
					trx,
					DEFAULT_CURRENCY,
					PNLClosed,
					command.userId,
					HistoryWalletType.FUTURE
				);

				await trx.getRepository(FutureCommandEntity).delete(command.id);

				// add logs
				const futureCommandLog = await trx.getRepository(FutureCommandLogEntity).save({
					...rest,
					status: CommonStatus.SUCCESS,
					desc: 'Reached TP',
					PNLClosed,
					closedVolume: command.entryPrice * command.leverage,
					closingPrice: +price,
					closedAt: new Date()
				});

				await this.notifService.sendNotification(this.DATA_NOTI, command.userId, {
					body: 'Your future order has been reached the TP',
					...futureCommandLog,
					action: 'future'
				});

				return;
			});
		}

		return;
	}

	async handleFutureLose(data: Record<string, any>[], price: string) {
		for (const command of data) {
			const { id, createdAt, updatedAt, deletedAt, lessThanEntryPrice, isEntry, ...rest } =
				command;
			const profit = this.futureCommandService.calcProfit(
				command.entryPrice,
				command.lossStopPrice,
				command.quantity,
				command.orderType === FutureCommandOrderType.LONG ? true : false
			);

			await this.entityManager.transaction(async (trx) => {
				const PNLClosed = command.quantity / command.leverage + profit;
				if (PNLClosed < 0) {
					await this.walletService.decrease(
						trx,
						DEFAULT_CURRENCY,
						Math.abs(PNLClosed),
						command.userId,
						HistoryWalletType.FUTURE
					);
				} else {
					await this.walletService.increase(
						trx,
						DEFAULT_CURRENCY,
						PNLClosed,
						command.userId,
						HistoryWalletType.FUTURE
					);
				}

				await trx.getRepository(FutureCommandEntity).delete(command.id);

				// add logs
				const futureCommandLog = await trx.getRepository(FutureCommandLogEntity).save({
					...rest,
					status: CommonStatus.SUCCESS,
					desc: 'Reached LS',
					PNLClosed,
					closedVolume: command.entryPrice * command.leverage,
					closingPrice: +price,
					closedAt: new Date()
				});

				await this.notifService.sendNotification(this.DATA_NOTI, command.userId, {
					body: 'Your future order has been reached the LS',
					...futureCommandLog,
					action: 'future'
				});

				return;
			});
		}

		return;
	}
}
