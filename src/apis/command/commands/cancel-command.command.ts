import { UserEntity } from '@app/apis/user/entities/user.entity';

export class CancelCommand {
	commandId!: string;
	user!: UserEntity;

	constructor(data: CancelCommand) {
		Object.assign(this, data);
	}
}
