import { UserEntity } from '@app/apis/user/entities/user.entity';

export class GetOneNotificationByIdCommand {
	id!: string;
	user!: UserEntity;

	constructor(data: GetOneNotificationByIdCommand) {
		Object.assign(this, data);
	}
}
