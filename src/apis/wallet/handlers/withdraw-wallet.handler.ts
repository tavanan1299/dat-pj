import { UserEntity } from '@app/apis/user/entities/user.entity';
import { WalletStatus, WalletType } from '@app/common/enums/wallet.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { WithdrawWalletCommand } from '../commands/withdraw-wallet.command';
import { PendingWalletEntity } from '../entities/pending-wallet.entity';
import { WalletEntity } from '../entities/wallet.entity';

@CommandHandler(WithdrawWalletCommand)
export class WithdrawWalletHandler implements ICommandHandler<WithdrawWalletCommand> {
	private logger = new Logger(WithdrawWalletHandler.name);

	constructor(
		@InjectEntityManager()
		private readonly entityManager: EntityManager
	) {}

	async execute(command: WithdrawWalletCommand) {
		this.logger.debug('execute');
		return await this.entityManager.transaction(async (trx) => {
			try {
				const { data, user } = command;

				const currentUser = await UserEntity.findOne({ where: { id: user.id } });
				if (!currentUser) {
					throw new BadRequestException('User not found.');
				}

				if (currentUser.isActive == false) {
					throw new BadRequestException('User has not been activated yet.');
				}

				const wallet = await WalletEntity.findOne({
					where: { userId: user.id, coinName: data.coinName }
				});

				const pendingWallet = await PendingWalletEntity.findOne({
					where: { userId: user.id, coinName: data.coinName, type: WalletType.WITHDRAW }
				});

				if (pendingWallet?.status == WalletStatus.APPROVE) {
					return 'Coin is approved!';
				}

				if (pendingWallet?.type == WalletType.DEPOSIT) {
					throw new BadRequestException('Coin is not withdraw yet!');
				}

				if (!wallet) {
					throw new BadRequestException('Wallet not found!');
				}

				if (wallet.quantity < data.quantity && wallet.coinName == data.coinName) {
					throw new BadRequestException(
						'The amount of money in the wallet is not enough'
					);
				}

				if (
					wallet &&
					data.coinName == wallet.coinName &&
					pendingWallet?.type == WalletType.WITHDRAW
				) {
					const currentQuantity = wallet.quantity - data.quantity;
					await this.updatePendingWallet(
						trx,
						user.id,
						data.coinName,
						WalletStatus.APPROVE,
						data.quantity
					);
					this.updateWallet(trx, user.id, data.coinName, currentQuantity);
					return 'Coin is withdraw successfully!';
				}
			} catch (error: any) {
				console.log(error);
				throw error;
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

	private async updatePendingWallet(
		entityManager: EntityManager,
		userId: string,
		coinName: string,
		status: WalletStatus,
		quantity: number
	) {
		await entityManager
			.createQueryBuilder()
			.update(PendingWalletEntity)
			.set({ status: status })
			.where({
				userId: userId,
				coinName: coinName,
				status: WalletStatus.PENDING,
				quantity: quantity
			})
			.execute();
	}
}
