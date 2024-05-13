import { PaginationDto } from '@common';
import { VerifyUserEntity } from '../entities/verify-user.entity';

export class GetAllVerifyUserPaginatedCommand {
	query!: PaginationDto<VerifyUserEntity>;

	constructor(data: GetAllVerifyUserPaginatedCommand) {
		Object.assign(this, data);
	}
}
