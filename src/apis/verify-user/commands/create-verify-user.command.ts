import { UserEntity } from '@app/apis/user/entities/user.entity';
import { CreateVerifyUserDto } from '../dto/create-verify-user.dto';

export class CreateVerifyUserCommand {
	user!: UserEntity;
	data!: CreateVerifyUserDto;

	constructor(data: CreateVerifyUserCommand) {
		Object.assign(this, data);
	}
}
