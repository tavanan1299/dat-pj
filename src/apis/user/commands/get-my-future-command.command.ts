import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyFutureCommandCommand {
	query!: PaginationDto<UserEntity>;
	user!: UserEntity;

	constructor(data: GetMyFutureCommandCommand) {
		Object.assign(this, data);
	}
}
