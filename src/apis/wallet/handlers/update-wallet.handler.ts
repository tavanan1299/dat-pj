import { UserEntity } from '@app/apis/user/entities/user.entity';
import { WalletStatus } from '@app/common/enums/wallet.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UpdateWalletCommand } from '../commands/update-wallet-command';
import { CreateWalletDtoWithUserId } from '../dto/create-wallet.dto';
import { PendingWalletEntity } from '../entities/pending-wallet.entity';
import { WalletEntity } from '../entities/wallet.entity';

@CommandHandler(UpdateWalletCommand)
export class UpdateWalletHandler implements ICommandHandler<UpdateWalletCommand> {
	private logger = new Logger(UpdateWalletHandler.name);

	constructor(
		@InjectEntityManager()
		private readonly entityManager: EntityManager
	) {}

	async execute(command: UpdateWalletCommand) {
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
					where: { userId: user.id, coinName: data.coinName }
				});

				if (pendingWallet?.status == WalletStatus.APPROVE) {
					return 'Coin is approved!';
				}

				if (
					(!wallet || data.coinName != wallet.coinName) &&
					pendingWallet?.status == WalletStatus.PENDING
				) {
					await this.updatePendingWallet(
						trx,
						user.id,
						data.coinName,
						WalletStatus.APPROVE,
						data.quantity
					);
					await this.createWallet(trx, {
						userId: user.id,
						coinName: data.coinName,
						quantity: data.quantity
					});
					return 'Create coin wallet successfully!';
				}

				if (wallet && data.coinName == wallet.coinName) {
					const currentQuantity = wallet.quantity + data.quantity;
					await this.updatePendingWallet(
						trx,
						user.id,
						data.coinName,
						WalletStatus.APPROVE,
						data.quantity
					);
					this.updateWallet(trx, user.id, data.coinName, currentQuantity);
					return 'Update coin wallet successfully!';
				}
			} catch (error: any) {
				console.log(error);
				throw error;
			}
		});
	}

	private async createWallet(
		entityManager: EntityManager,
		walletData: CreateWalletDtoWithUserId
	) {
		await entityManager.save(WalletEntity, walletData);
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
