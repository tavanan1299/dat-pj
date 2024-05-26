import { UserEntity } from '@app/apis/user/entities/user.entity';
import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { MarketLogStatus, MarketLogType } from '@app/common/enums/status.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateMarketLogCommand } from '../commands/create-market-log.command';
import { MarketLogEntity } from '../entities/market-log.entity';

@CommandHandler(CreateMarketLogCommand)
export class CreateMarketLogHandler implements ICommandHandler<CreateMarketLogCommand> {
	private logger = new Logger(CreateMarketLogHandler.name);

	constructor(
		@InjectEntityManager()
		private readonly entityManager: EntityManager
	) {}

	async execute(command: CreateMarketLogCommand) {
		this.logger.debug('execute');
		return await this.entityManager.transaction(async (trx) => {
			try {
				const { data, user } = command;
				const currentUser = await UserEntity.findOne({
					where: { id: user.id }
				});
				if (!currentUser) {
					throw new BadRequestException('User not found');
				}

				const currentWallet = await trx.getRepository(WalletEntity).findOne({
					where: {
						userId: user.id,
						coinName: data.coinName
					}
				});

				if (currentWallet) {
					await this.updateWallet(
						trx,
						user.id,
						data.coinName,
						currentWallet?.quantity + data.quantity
					);
				}
				if (!currentWallet) {
					const newWallet = WalletEntity.create({
						userId: currentUser.id,
						coinName: data.coinName,
						quantity: data.quantity
					});
					await WalletEntity.save(newWallet);
				}

				const newMarketLog = MarketLogEntity.create({
					coinName: data.coinName,
					quantity: data.quantity,
					currentPrice: data.currentPrice,
					totalPay: data.totalPay,
					userId: currentUser.id,
					type: MarketLogType.MARKET,
					status: MarketLogStatus.SUCCESS
				});

				await MarketLogEntity.save(newMarketLog);

				return 'Create market log successfully';
			} catch (error) {
				console.log(error);
				throw new BadRequestException('An error occurred. Please try again!');
			}
		});
	}

	private async updateWallet(
		entityManager: EntityManager,
		userId: string,
		coinName: string,
		quantity: number
	) {
		await entityManager
			.createQueryBuilder()
			.update(WalletEntity)
			.set({ quantity: quantity })
			.where({
				userId: userId,
				coinName: coinName
			})
			.execute();
	}
}
