import { UserEntity } from '@app/apis/user/entities/user.entity';
import { UpdateVerifyUserDto } from '../dto/update-verify-user.dto';

export class UpdateVerifyUserCommand {
	user!: UserEntity;
	data!: UpdateVerifyUserDto;

	constructor(data: UpdateVerifyUserCommand) {
		Object.assign(this, data);
	}
}
