import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { VerifyUserEntity } from '../verify-user/entities/verify-user.entity';
import { PendingWalletEntity } from './entities/pending-wallet.entity';
import { WalletEntity } from './entities/wallet.entity';
import { ApprovePendingWalletHandler } from './handlers/approve-pending-wallet.handler';
import { GetAllPendingWalletPaginatedHandler } from './handlers/get-all-pending-wallet-paginated.handler';
import { TransferPendingWalletHandler } from './handlers/transfer-pending-wallet.handler';
import { IPendingWallet } from './pending-wallet.interface';
import { PendingWalletService } from './pending-wallet.service';
import { WalletController } from './wallet.controller';
import { IWallet } from './wallet.interface';
import { WalletService } from './wallet.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, VerifyUserEntity, WalletEntity, PendingWalletEntity])
	],
	controllers: [WalletController],
	providers: [
		WalletService,
		{
			provide: IWallet,
			useClass: WalletService
		},
		{
			provide: IPendingWallet,
			useClass: PendingWalletService
		},
		ApprovePendingWalletHandler,
		TransferPendingWalletHandler,
		GetAllPendingWalletPaginatedHandler
	]
})
export class WalletModule {}
