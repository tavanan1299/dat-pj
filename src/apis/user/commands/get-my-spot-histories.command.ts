import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMySpotHistoriesCommand {
	query!: PaginationDto<UserEntity>;
	user!: UserEntity;

	constructor(data: GetMySpotHistoriesCommand) {
		Object.assign(this, data);
	}
}
