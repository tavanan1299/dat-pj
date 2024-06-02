import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyCommandCommand {
	query!: PaginationDto<UserEntity>;
	user!: UserEntity;

	constructor(data: GetMyCommandCommand) {
		Object.assign(this, data);
	}
}
