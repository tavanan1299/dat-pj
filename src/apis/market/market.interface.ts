import { BaseService } from '@common';
import { MarketLogEntity } from './entities/market-log.entity';

export abstract class IMarket extends BaseService<MarketLogEntity> {}
