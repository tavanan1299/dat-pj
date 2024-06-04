import { WalletLogEntity } from '@app/apis/log/wallet-log/entities/wallet-log.entity';
import { UserEntity } from '@app/apis/user/entities/user.entity';
import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { CommandType, CommonStatus, MarketLogType } from '@app/common/enums/status.enum';
import { WalletLogType } from '@app/common/enums/walletLog.enum';
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
		try {
			const { data, user } = command;
			const currentUser = await UserEntity.findOne({
				where: { id: user.id }
			});
			if (!currentUser) {
				throw new BadRequestException('User not found');
			}

			let currentWallet = await this.entityManager.getRepository(WalletEntity).findOne({
				where: {
					userId: user.id,
					coinName: data.coinName
				}
			});

			if (!currentWallet) {
				const newWallet = WalletEntity.create({
					userId: currentUser.id,
					coinName: data.coinName,
					quantity: data.quantity
				});
				currentWallet = await WalletEntity.save(newWallet);
			}

			switch (data.type) {
				case CommandType.BUY:
					await this.entityManager.transaction(async (trx) => {
						await this.updateWallet(
							trx,
							user.id,
							data.coinName,
							currentWallet?.quantity + data.quantity
						);

						await trx.getRepository(MarketLogEntity).save(
							MarketLogEntity.create({
								coinName: data.coinName,
								quantity: data.quantity,
								currentPrice: data.currentPrice,
								totalPay: data.totalPay,
								userId: currentUser.id,
								type: MarketLogType.MARKET_BUY,
								status: CommonStatus.SUCCESS
							})
						);

						await trx.getRepository(WalletLogEntity).save(
							WalletLogEntity.create({
								coinName: data.coinName,
								quantity: data.quantity,
								remainBalance: +currentWallet?.quantity + +data.quantity,
								userId: currentUser.id,
								walletId: currentWallet.id,
								type: WalletLogType.MARKET_BUY
							})
						);
					});

					return 'Create successfully';

				case CommandType.SELL:
					if (currentWallet && currentWallet?.quantity < data.quantity) {
						throw new BadRequestException('Your wallet is not enough');
					}
					await this.entityManager.transaction(async (trx) => {
						await this.updateWallet(
							trx,
							user.id,
							data.coinName,
							currentWallet?.quantity - data.quantity
						);

						await trx.getRepository(MarketLogEntity).save(
							MarketLogEntity.create({
								coinName: data.coinName,
								quantity: data.quantity,
								currentPrice: data.currentPrice,
								totalPay: data.totalPay,
								userId: currentUser.id,
								type: MarketLogType.MARKET_SELL,
								status: CommonStatus.SUCCESS
							})
						);

						await trx.getRepository(WalletLogEntity).save(
							WalletLogEntity.create({
								coinName: data.coinName,
								quantity: data.quantity,
								remainBalance: +currentWallet?.quantity - +data.quantity,
								userId: currentUser.id,
								walletId: currentWallet.id,
								type: WalletLogType.MARKET_SELL
							})
						);
					});

					return 'Create successfully';
				default:
					throw new BadRequestException('Some thing went wrong');
			}
		} catch (error) {
			// console.log(error);
			throw error;
		}
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
