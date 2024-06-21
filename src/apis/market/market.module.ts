import { FirebaseService } from '@app/modules/firebase/firebase.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletLogEntity } from '../log/wallet-log/entities/wallet-log.entity';
import { NotificationReceives } from '../notification/entities/notification-receive.entity';
import { Notification } from '../notification/entities/notification.entity';
import { INotification } from '../notification/notification.interface';
import { NotificationService } from '../notification/notification.service';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { IWallet } from '../wallet/wallet.interface';
import { WalletService } from '../wallet/wallet.service';
import { MarketLogEntity } from './entities/market-log.entity';
import { CreateMarketLogHandler } from './handlers/create-market-log.handler';
import { MarketController } from './market.controller';
import { IMarket } from './market.interface';
import { MarketService } from './market.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			MarketLogEntity,
			WalletEntity,
			WalletLogEntity,
			Notification,
			NotificationReceives
		])
	],
	controllers: [MarketController],
	providers: [
		{
			provide: IMarket,
			useClass: MarketService
		},
		{
			provide: IWallet,
			useClass: WalletService
		},
		{
			provide: INotification,
			useClass: NotificationService
		},
		CreateMarketLogHandler,
		FirebaseService
	],
	exports: [IMarket]
})
export class MarketLogModule {}
