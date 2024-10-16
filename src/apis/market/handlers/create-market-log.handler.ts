import { UserEntity } from '@app/apis/user/entities/user.entity';
import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { IWallet } from '@app/apis/wallet/wallet.interface';
import { DEFAULT_CURRENCY, HistoryWalletType } from '@app/common/constants/constant';
import { CommandType, CommonStatus, MarketLogType } from '@app/common/enums/status.enum';
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
		private readonly entityManager: EntityManager,
		private readonly walletService: IWallet
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
					quantity: 0
				});
				currentWallet = await WalletEntity.save(newWallet);
			}

			switch (data.type) {
				case CommandType.BUY:
					await this.entityManager.transaction(async (trx) => {
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							data.totalPay,
							currentUser.id,
							HistoryWalletType.SPOT_MARKET
						);

						await this.walletService.increase(
							trx,
							data.coinName,
							data.quantity,
							currentUser.id,
							HistoryWalletType.SPOT_MARKET
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
					});

					return 'Create successfully';

				case CommandType.SELL:
					if (currentWallet && currentWallet?.quantity < data.quantity) {
						throw new BadRequestException('Your wallet is not enough');
					}
					await this.entityManager.transaction(async (trx) => {
						await this.walletService.decrease(
							trx,
							data.coinName,
							data.quantity,
							currentUser.id,
							HistoryWalletType.SPOT_MARKET
						);

						await this.walletService.increase(
							trx,
							DEFAULT_CURRENCY,
							data.totalPay,
							currentUser.id,
							HistoryWalletType.SPOT_MARKET
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
}
