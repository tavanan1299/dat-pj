import { Module } from '@nestjs/common';
import { CreateWalletHandler } from './handlers/createWallet.handlers';
import { WalletController } from './wallet.controller';
import { IWallet } from './wallet.interface';
import { WalletService } from './wallet.service';

@Module({
	controllers: [WalletController],
	providers: [
		{
			provide: IWallet,
			useClass: WalletService
		},
		CreateWalletHandler
	],
	exports: [IWallet]
})
export class WalletModule {}
