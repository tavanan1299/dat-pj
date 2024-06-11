import { UserEntity } from '@app/apis/user/entities/user.entity';
import { PushNotificationDto } from '../dto/push-notification.dto';

export class PushOneNotificationByIdCommand {
	id!: string;
	data!: PushNotificationDto;
	user!: UserEntity;

	constructor(data: PushOneNotificationByIdCommand) {
		Object.assign(this, data);
	}
}
