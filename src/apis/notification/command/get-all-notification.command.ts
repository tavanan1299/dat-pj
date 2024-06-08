import { PaginationDto } from '@common';
import { NotificationReceives } from '../entities/notification-receive.entity';

export class GetAllNotificationPaginatedCommand {
	query!: PaginationDto<NotificationReceives>;
	user!: User;

	constructor(data: GetAllNotificationPaginatedCommand) {
		Object.assign(this, data);
	}
}
