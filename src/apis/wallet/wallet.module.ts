import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingWalletEntity } from './entities/pending-wallet.entity';
import { WalletEntity } from './entities/wallet.entity';
import { CreateWalletHandler } from './handlers/create-wallet.handler';
import { CreateWithdrawWalletHandler } from './handlers/create-withdraw-wallet.handler';
import { GetAllUserPaginatedHandler } from './handlers/get-all-wallet-paginated.handler';
import { UpdateWalletHandler } from './handlers/update-wallet.handler';
import { WithdrawWalletHandler } from './handlers/withdraw-wallet.handler';
import { WalletController } from './wallet.controller';
import { IWallet } from './wallet.interface';
import { WalletService } from './wallet.service';

@Module({
	imports: [TypeOrmModule.forFeature([WalletModule, PendingWalletEntity, WalletEntity])],
	controllers: [WalletController],
	providers: [
		{
			provide: IWallet,
			useClass: WalletService
		},
		CreateWalletHandler,
		CreateWithdrawWalletHandler,
		GetAllUserPaginatedHandler,
		UpdateWalletHandler,
		WithdrawWalletHandler
	],
	exports: [IWallet]
})
export class WalletModule {}
