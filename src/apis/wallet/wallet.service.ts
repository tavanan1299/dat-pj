import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingWalletEntity } from './entities/pending-wallet.entity';
import { IWallet } from './wallet.interface';

@Injectable()
export class WalletService extends IWallet {
	notFoundMessage = 'Wallet Not Found!';

	constructor(
		@InjectRepository(PendingWalletEntity)
		private readonly verifyuserRepo: Repository<PendingWalletEntity>
	) {
		super(verifyuserRepo);
	}
}
