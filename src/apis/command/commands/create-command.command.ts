import { UserEntity } from '@app/apis/user/entities/user.entity';
import { CreateCommandDto } from '../dto/create-command.dto';

export class CreateCommand {
	user!: UserEntity;
	data!: CreateCommandDto;

	constructor(data: CreateCommand) {
		Object.assign(this, data);
	}
}
