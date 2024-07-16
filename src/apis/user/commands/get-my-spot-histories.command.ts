import { CommandLogEntity } from '@app/apis/log/command-log/entities/command-log.entity';
import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMySpotHistoriesCommand {
	query!: PaginationDto<CommandLogEntity>;
	user!: UserEntity;

	constructor(data: GetMySpotHistoriesCommand) {
		Object.assign(this, data);
	}
}
