import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyStacksCommand {
	query!: PaginationDto<UserEntity>;
	user!: UserEntity;

	constructor(data: GetMyStacksCommand) {
		Object.assign(this, data);
	}
}
