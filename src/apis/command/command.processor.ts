import { CommandType } from '@app/common/enums/status.enum';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { CommandEntity } from './entities/command.entity';

@Processor('binance:coin', { concurrency: 2 })
export class CommandProcessor extends WorkerHost {
	private logger = new Logger();

	constructor(private readonly entityManager: EntityManager) {
		super();
	}

	async process(job: Job<any, any, string>): Promise<any> {
		switch (job.name) {
			case 'addBinanceJob':
				const data = await this.matchCommand(job.data);
				console.log({ data });
				return data;

			default:
				throw new Error('No job name match');
		}
	}

	async matchCommand(data: Record<string, any>) {
		this.logger.log('Processing match command....');
		const matchSellData = await this.entityManager.getRepository(CommandEntity).find({
			where: [
				{
					type: CommandType.SELL,
					coinName: this.USTD2CoinName(data.s),
					expectPrice: MoreThanOrEqual(data.p)
				},
				{
					type: CommandType.SELL,
					coinName: this.USTD2CoinName(data.s),
					lossStopPrice: LessThanOrEqual(data.p)
				}
			]
		});

		this.handleSell(matchSellData);

		const matchBuyData = await this.entityManager.getRepository(CommandEntity).find({
			where: {
				type: CommandType.BUY,
				coinName: this.USTD2CoinName(data.s),
				expectPrice: LessThanOrEqual(data.p)
			}
		});

		this.handleSell(matchBuyData);

		return;
	}

	async handleSell(data: Record<string, any>[]) {
		await Promise.all(
			data.map((command) =>
				this.entityManager.transaction(async (trx) => {
					let wallet = await trx.getRepository(WalletEntity).findOne({
						where: {
							userId: command.userId,
							coinName: command.coinName
						}
					});

					if (!wallet) {
						wallet = await trx
							.getRepository(WalletEntity)
							.save({ coinName: command.coinName, quantity: 0 });
					}

					if (wallet && wallet?.quantity < command.quantity) {
						await trx.getRepository(CommandEntity).delete(command.id);
						// add fail log

						return;
					}

					await trx.getRepository(WalletEntity).save({
						...wallet,
						quantity: wallet?.quantity - command.quantity
					});

					await trx.getRepository(CommandEntity).delete(command.id);

					// add logs

					return;
				})
			)
		);

		return;
	}

	async handleBuy(data: Record<string, any>[]) {
		await Promise.all(
			data.map((command) =>
				this.entityManager.transaction(async (trx) => {
					let wallet = await trx.getRepository(WalletEntity).findOne({
						where: {
							userId: command.userId,
							coinName: command.coinName
						}
					});

					if (!wallet) {
						wallet = await trx
							.getRepository(WalletEntity)
							.save({ coinName: command.coinName, quantity: 0 });
					}

					await trx.getRepository(WalletEntity).save({
						...wallet,
						quantity: wallet?.quantity + command.quantity
					});

					await trx.getRepository(CommandEntity).delete(command.id);

					// add logs
				})
			)
		);

		return;
	}

	private coinName2USTD(name: string) {
		return `${name.toUpperCase()}USTD`;
	}

	private USTD2CoinName(name: string) {
		return name.replace('USTD', '').toLowerCase();
	}
}
