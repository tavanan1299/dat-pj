import { StackingEntity } from '@app/apis/stacking/entities/stacking.entity';
import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyStacksCommand {
	query!: PaginationDto<StackingEntity>;
	user!: UserEntity;

	constructor(data: GetMyStacksCommand) {
		Object.assign(this, data);
	}
}
