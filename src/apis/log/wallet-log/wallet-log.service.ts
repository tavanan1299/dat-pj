import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletLogEntity } from './entities/wallet-log.entity';
import { IWalletLog } from './wallet-log.interface';

@Injectable()
export class WalletLogService extends IWalletLog {
	notFoundMessage = 'Wallet log Not Found!';

	constructor(
		@InjectRepository(WalletLogEntity)
		private readonly walletLogRepo: Repository<WalletLogEntity>
	) {
		super(walletLogRepo);
	}
}
