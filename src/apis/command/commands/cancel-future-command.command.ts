import { UserEntity } from '@app/apis/user/entities/user.entity';
import { CloseFutureCommandDto } from '../dto/close-future-command.dto';

export class CancelFutureCommand {
	commandId!: string;
	user!: UserEntity;
	data!: CloseFutureCommandDto;

	constructor(data: CancelFutureCommand) {
		Object.assign(this, data);
	}
}
