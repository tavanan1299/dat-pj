import { UserEntity } from '@app/apis/user/entities/user.entity';
import { PushNotificationForOneUser } from '../dto/push-notification-for-one-user.dto';

export class PushOneNotificationByIdCommand {
	data!: PushNotificationForOneUser;
	user!: UserEntity;

	constructor(data: PushOneNotificationByIdCommand) {
		Object.assign(this, data);
	}
}
