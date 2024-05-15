import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingWalletEntity } from './entities/pending-wallet.entity';
import { IPendingWallet } from './pending-wallet.interface';

@Injectable()
export class PendingWalletService extends IPendingWallet {
	notFoundMessage = 'Pending Wallet Not Found!';

	constructor(
		@InjectRepository(PendingWalletEntity)
		private readonly verifyuserRepo: Repository<PendingWalletEntity>
	) {
		super(verifyuserRepo);
	}
}
