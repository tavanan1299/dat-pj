import { UserEntity } from '@app/apis/user/entities/user.entity';

export class CancelFutureCommand {
	commandId!: string;
	user!: UserEntity;

	constructor(data: CancelFutureCommand) {
		Object.assign(this, data);
	}
}
