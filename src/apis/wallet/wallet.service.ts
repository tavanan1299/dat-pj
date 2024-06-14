import { WalletLogType } from '@app/common/enums/walletLog.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WalletLogEntity } from '../log/wallet-log/entities/wallet-log.entity';
import { WalletEntity } from './entities/wallet.entity';
import { IWallet } from './wallet.interface';

@Injectable()
export class WalletService extends IWallet {
	notFoundMessage = 'Wallet not found';

	constructor(
		@InjectRepository(WalletEntity)
		private readonly walletRepo: Repository<WalletEntity>,
		@InjectRepository(WalletLogEntity)
		private readonly walletLogRepo: Repository<WalletLogEntity>
	) {
		super(walletRepo);
	}

	async decrease(trx: EntityManager, coinName: string, coinQuantity: number, userId: string) {
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

		if (currentWallet.quantity < coinQuantity) {
			throw new BadRequestException('The balance in the wallet is not enough');
		}

		await trx.getRepository(WalletEntity).update(currentWallet.id, {
			...currentWallet,
			quantity: +currentWallet.quantity - +coinQuantity
		});

		await trx.getRepository(WalletLogEntity).save({
			userId: currentWallet.userId,
			walletId: currentWallet.id,
			coinName: currentWallet.coinName,
			quantity: coinQuantity,
			remainBalance: +currentWallet.quantity - +coinQuantity,
			type: WalletLogType.COMMAND_SELL
		});
	}

	async increase(trx: EntityManager, coinName: string, coinQuantity: number, userId: string) {
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
			...currentWallet,
			quantity: +currentWallet.quantity + +coinQuantity
		});

		await trx.getRepository(WalletLogEntity).save({
			userId: currentWallet.userId,
			walletId: currentWallet.id,
			coinName: currentWallet.coinName,
			quantity: coinQuantity,
			remainBalance: +currentWallet.quantity + +coinQuantity,
			type: WalletLogType.COMMAND_BUY
		});
	}
}
