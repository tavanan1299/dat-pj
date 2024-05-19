import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketLogEntity } from './entities/market-log.entity';
import { CreateMarketLogHandler } from './handlers/create-market-log.handler';
import { MarketController } from './market.controller';
import { IMarket } from './market.interface';
import { MarketService } from './market.service';

@Module({
	imports: [TypeOrmModule.forFeature([MarketLogEntity])],
	controllers: [MarketController],
	providers: [
		{
			provide: IMarket,
			useClass: MarketService
		},
		CreateMarketLogHandler
	],
	exports: [IMarket]
})
export class MarketLogModule {}
