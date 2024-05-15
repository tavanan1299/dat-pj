import { UserEntity } from '@app/apis/user/entities/user.entity';

export class CreateVerifyUserCommand {
	user!: UserEntity;
	data!: any;

	constructor(data: CreateVerifyUserCommand) {
		Object.assign(this, data);
	}
}
