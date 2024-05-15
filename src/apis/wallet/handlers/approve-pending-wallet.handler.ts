import { WalletStatus, WalletType } from '@app/common/enums/wallet.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ApprovePendingWalletCommand } from '../commands/approve-pending-wallet.command';
import { PendingWalletEntity } from '../entities/pending-wallet.entity';
import { WalletEntity } from '../entities/wallet.entity';
import { IPendingWallet } from '../pending-wallet.interface';

@CommandHandler(ApprovePendingWalletCommand)
export class ApprovePendingWalletHandler implements ICommandHandler<ApprovePendingWalletCommand> {
	private logger = new Logger(ApprovePendingWalletHandler.name);

	constructor(
		private readonly pendingWallet: IPendingWallet,
		@InjectEntityManager()
		private readonly entityManager: EntityManager
	) {}

	async execute(command: ApprovePendingWalletCommand) {
		this.logger.log(command);
		const { id } = command;

		const pendingWallet = await PendingWalletEntity.findOne({ where: { id } });
		if (!pendingWallet) {
			throw new BadRequestException('No request found');
		}

		if (pendingWallet.status === WalletStatus.APPROVE) {
			throw new BadRequestException('Request already approved');
		}

		let wallet = await WalletEntity.findOne({
			where: {
				userId: pendingWallet.userId,
				coinName: pendingWallet.coinName
			}
		});

		if (!wallet) {
			const newWallet = WalletEntity.create({
				userId: pendingWallet.userId,
				coinName: pendingWallet.coinName,
				quantity: 0
			});

			wallet = await WalletEntity.save(newWallet);
		}

		if (pendingWallet.type === WalletType.WITHDRAW) {
			return this.withdrawWallet(wallet, pendingWallet);
		} else {
			return this.depositWallet(wallet, pendingWallet);
		}
	}

	private async withdrawWallet(wallet: WalletEntity, pendingWallet: PendingWalletEntity) {
		if (wallet && wallet?.quantity < pendingWallet.quantity) {
			throw new BadRequestException('Your wallet is not enough');
		}

		await this.entityManager.transaction(async (trx) => {
			await trx
				.getRepository(PendingWalletEntity)
				.save({ ...pendingWallet, status: WalletStatus.APPROVE });
			await trx.getRepository(WalletEntity).save({
				...wallet,
				quantity: wallet?.quantity - pendingWallet.quantity
			});
		});

		return 'Withdraw success';
	}

	private async depositWallet(wallet: WalletEntity, pendingWallet: PendingWalletEntity) {
		await this.entityManager.transaction(async (trx) => {
			await trx
				.getRepository(PendingWalletEntity)
				.save({ ...pendingWallet, status: WalletStatus.APPROVE });
			await trx.getRepository(WalletEntity).save({
				...wallet,
				quantity: wallet?.quantity + pendingWallet.quantity
			});
		});

		return 'Deposit success';
	}
}
