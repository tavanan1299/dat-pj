import { UserEntity } from '@app/apis/user/entities/user.entity';
import { CreateFutureCommandDto } from '../dto/create-future-command.dto';

export class CreateFutureCommand {
	user!: UserEntity;
	data!: CreateFutureCommandDto;

	constructor(data: CreateFutureCommand) {
		Object.assign(this, data);
	}
}
