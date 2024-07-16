import { MarketLogEntity } from '@app/apis/market/entities/market-log.entity';
import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyMarketHistoriesCommand {
	query!: PaginationDto<MarketLogEntity>;
	user!: UserEntity;

	constructor(data: GetMyMarketHistoriesCommand) {
		Object.assign(this, data);
	}
}
