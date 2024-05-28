import { UserEntity } from '@app/apis/user/entities/user.entity';
import { WalletStatus, WalletType } from '@app/common/enums/wallet.enum';
import { IMailService } from '@app/modules/mail';
import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
		private readonly entityManager: EntityManager,
		private readonly mailService: IMailService,
		private configService: ConfigService
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

		const currentUser = await UserEntity.findOne({
			where: {
				id: pendingWallet.userId
			}
		});

		const walletQuantityWithdraw = wallet?.quantity - pendingWallet.quantity;

		await this.entityManager.transaction(async (trx) => {
			await trx
				.getRepository(PendingWalletEntity)
				.save({ ...pendingWallet, status: WalletStatus.APPROVE });
			await trx.getRepository(WalletEntity).save({
				...wallet,
				quantity: walletQuantityWithdraw
			});
		});

		this.mailService.sendTransfer({
			coinName: pendingWallet.coinName,
			to: this.configService.get('MAIL_DEFAULT')!,
			quantity: pendingWallet.quantity,
			type: WalletType.WITHDRAW,
			userId: pendingWallet.userId,
			email: currentUser!.email
		});

		return 'Withdraw success';
	}

	private async depositWallet(wallet: WalletEntity, pendingWallet: PendingWalletEntity) {
		const walletQuantityDeposit = wallet?.quantity + pendingWallet.quantity;
		const currentUser = await UserEntity.findOne({
			where: {
				id: pendingWallet.userId
			}
		});

		await this.entityManager.transaction(async (trx) => {
			await trx
				.getRepository(PendingWalletEntity)
				.save({ ...pendingWallet, status: WalletStatus.APPROVE });
			await trx.getRepository(WalletEntity).save({
				...wallet,
				quantity: walletQuantityDeposit
			});
		});

		this.mailService.sendTransfer({
			coinName: pendingWallet.coinName,
			to: this.configService.get('MAIL_DEFAULT')!,
			quantity: pendingWallet.quantity,
			type: WalletType.DEPOSIT,
			userId: pendingWallet.userId,
			email: currentUser!.email
		});

		return 'Deposit success';
	}
}
