import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyFutureHistoriesCommand {
	query!: PaginationDto<UserEntity>;
	user!: UserEntity;

	constructor(data: GetMyFutureHistoriesCommand) {
		Object.assign(this, data);
	}
}
