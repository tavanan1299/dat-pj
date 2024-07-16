import { FutureCommandEntity } from '@app/apis/command/entities/future-command.entity';
import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyFutureCommandCommand {
	query!: PaginationDto<FutureCommandEntity>;
	user!: UserEntity;

	constructor(data: GetMyFutureCommandCommand) {
		Object.assign(this, data);
	}
}
