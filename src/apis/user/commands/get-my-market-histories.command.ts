import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyMarketHistoriesCommand {
	query!: PaginationDto<UserEntity>;
	user!: UserEntity;

	constructor(data: GetMyMarketHistoriesCommand) {
		Object.assign(this, data);
	}
}
