import { FutureCommandLogEntity } from '@app/apis/log/future-command-log/entities/future-command-log.entity';
import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyFutureHistoriesCommand {
	query!: PaginationDto<FutureCommandLogEntity>;
	user!: UserEntity;

	constructor(data: GetMyFutureHistoriesCommand) {
		Object.assign(this, data);
	}
}
