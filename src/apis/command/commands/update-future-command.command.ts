import { UserEntity } from '@app/apis/user/entities/user.entity';
import { UpdateFutureCommandDto } from '../dto/update-future-command.dto';

export class UpdateFutureCommand {
	commandId!: string;
	user!: UserEntity;
	data!: UpdateFutureCommandDto;

	constructor(data: UpdateFutureCommand) {
		Object.assign(this, data);
	}
}
