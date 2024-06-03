import { WalletLogType } from '@app/common/enums/walletLog.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

	async decrease(coinName: string, coinQuantity: number, userId: string) {
		const currentWallet = await this.walletRepo.findOne({
			where: {
				coinName,
				userId
			}
		});

		if (!currentWallet) {
			throw new BadRequestException('Wallet not found!');
		}

		await this.walletRepo.update(currentWallet.id, {
			...currentWallet,
			quantity: +currentWallet.quantity - +coinQuantity
		});

		await this.walletLogRepo.save({
			userId: currentWallet.userId,
			walletId: currentWallet.id,
			coinName: currentWallet.coinName,
			quantity: coinQuantity,
			remainBalance: +currentWallet.quantity - +coinQuantity,
			type: WalletLogType.COMMAND_SELL
		});
	}

	async increase(coinName: string, coinQuantity: number, userId: string) {
		const currentWallet = await this.walletRepo.findOne({
			where: {
				coinName,
				userId
			}
		});

		if (!currentWallet) {
			throw new BadRequestException('Wallet not found!');
		}

		await this.walletRepo.update(currentWallet.id, {
			...currentWallet,
			quantity: +currentWallet.quantity + +coinQuantity
		});

		await this.walletLogRepo.save({
			userId: currentWallet.userId,
			walletId: currentWallet.id,
			coinName: currentWallet.coinName,
			quantity: coinQuantity,
			remainBalance: +currentWallet.quantity + +coinQuantity,
			type: WalletLogType.COMMAND_BUY
		});
	}
}
