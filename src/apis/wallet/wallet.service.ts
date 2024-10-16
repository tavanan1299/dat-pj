import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WalletLogEntity } from '../log/wallet-log/entities/wallet-log.entity';
import { INotification } from '../notification/notification.interface';
import { Notification_Type } from '../notification/types';
import { WalletEntity } from './entities/wallet.entity';
import { IWallet } from './wallet.interface';

@Injectable()
export class WalletService extends IWallet {
	notFoundMessage = 'Wallet not found';

	constructor(
		@InjectRepository(WalletEntity)
		private readonly walletRepo: Repository<WalletEntity>,
		@InjectRepository(WalletLogEntity)
		private readonly walletLogRepo: Repository<WalletLogEntity>,
		private readonly notificationService: INotification
	) {
		super(walletRepo);
	}

	async decrease(
		trx: EntityManager,
		coinName: string,
		coinQuantity: number,
		userId: string,
		logType: string
	) {
		let currentWallet = await trx.getRepository(WalletEntity).findOne({
			where: {
				coinName,
				userId
			}
		});

		if (!currentWallet) {
			currentWallet = await trx.getRepository(WalletEntity).save({
				userId,
				coinName,
				quantity: 0
			});
		}

		const DATA_NOTI: Notification_Type = {
			message: 'Balance fluctuations',
			entity: 'transaction',
			entityKind: 'create',
			notiType: 'announcement'
		};

		let remainBalance = +currentWallet.quantity - +coinQuantity;
		let desc = 'decrease';

		if (currentWallet.quantity < coinQuantity) {
			remainBalance = 0;
			desc = 'liquidation';
		}

		await trx.getRepository(WalletEntity).update(currentWallet.id, {
			quantity: remainBalance
		});

		await this.notificationService.sendNotification(DATA_NOTI, userId, {
			body: 'You have had an amount deducted from your wallet',
			coinName,
			amount: coinQuantity,
			remainBalance,
			action: 'decrease'
		});

		await trx.getRepository(WalletLogEntity).save({
			userId: currentWallet.userId,
			walletId: currentWallet.id,
			coinName: currentWallet.coinName,
			quantity: coinQuantity,
			remainBalance,
			type: logType,
			desc
		});
	}

	async increase(
		trx: EntityManager,
		coinName: string,
		coinQuantity: number,
		userId: string,
		logType: string
	) {
		let currentWallet = await trx.getRepository(WalletEntity).findOne({
			where: {
				coinName,
				userId
			}
		});

		if (!currentWallet) {
			currentWallet = await trx.getRepository(WalletEntity).save({
				userId,
				coinName,
				quantity: 0
			});
		}

		await trx.getRepository(WalletEntity).update(currentWallet.id, {
			quantity: +currentWallet.quantity + +coinQuantity
		});

		const DATA_NOTI: Notification_Type = {
			message: 'Balance fluctuations',
			entity: 'transaction',
			entityKind: 'create',
			notiType: 'announcement'
		};

		await this.notificationService.sendNotification(DATA_NOTI, userId, {
			body: 'You have received an amount of coins from your wallet',
			coinName,
			amount: coinQuantity,
			remainBalance: +currentWallet.quantity + +coinQuantity,
			action: 'increase'
		});

		await trx.getRepository(WalletLogEntity).save({
			userId: currentWallet.userId,
			walletId: currentWallet.id,
			coinName: currentWallet.coinName,
			quantity: coinQuantity,
			remainBalance: +currentWallet.quantity + +coinQuantity,
			type: logType,
			desc: 'increase'
		});
	}
}
