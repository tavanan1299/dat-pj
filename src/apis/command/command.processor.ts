import { CommandType, CommonStatus } from '@app/common/enums/status.enum';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CommandLogEntity } from '../log/command-log/entities/command-log.entity';
import { IWallet } from '../wallet/wallet.interface';
import { CommandEntity } from './entities/command.entity';

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
				coinName: this.USDT2CoinName(data.s),
				expectPrice: LessThanOrEqual(data.p)
			}
		});

		await this.handleSell(matchSellData);

		const matchSellLostStopData = await this.entityManager.getRepository(CommandEntity).find({
			where: {
				type: CommandType.SELL,
				coinName: this.USDT2CoinName(data.s),
				lossStopPrice: MoreThanOrEqual(data.p)
			}
		});

		await this.handleSell(matchSellLostStopData, true);

		const matchBuyData = await this.entityManager.getRepository(CommandEntity).find({
			where: {
				type: CommandType.BUY,
				coinName: this.USDT2CoinName(data.s),
				expectPrice: MoreThanOrEqual(data.p)
			}
		});

		await this.handleBuy(matchBuyData);

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

	private coinName2USDT(name: string) {
		return `${name.toUpperCase()}USDT`;
	}

	private USDT2CoinName(name: string) {
		return name.replaceAll('USDT', '').toLowerCase();
	}
}
