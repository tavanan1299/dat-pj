import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyTransHistoriesCommand {
	query!: PaginationDto<UserEntity>;
	user!: UserEntity;

	constructor(data: GetMyTransHistoriesCommand) {
		Object.assign(this, data);
	}
}
