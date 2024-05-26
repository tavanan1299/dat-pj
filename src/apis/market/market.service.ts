import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketLogEntity } from './entities/market-log.entity';
import { IMarket } from './market.interface';

@Injectable()
export class MarketService extends IMarket {
	notFoundMessage = 'Stacking Not Found!';

	constructor(
		@InjectRepository(MarketLogEntity)
		private readonly verifyuserRepo: Repository<MarketLogEntity>
	) {
		super(verifyuserRepo);
	}
}
