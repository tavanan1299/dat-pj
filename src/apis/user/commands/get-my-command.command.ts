import { CommandEntity } from '@app/apis/command/entities/command.entity';
import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyCommandCommand {
	query!: PaginationDto<CommandEntity>;
	user!: UserEntity;

	constructor(data: GetMyCommandCommand) {
		Object.assign(this, data);
	}
}
