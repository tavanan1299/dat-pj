import { PushNotificationDto } from '../dto/push-notification.dto';

export class PushAllNotificationCommand {
	data!: PushNotificationDto;
	user!: User;

	constructor(data: PushAllNotificationCommand) {
		Object.assign(this, data);
	}
}
