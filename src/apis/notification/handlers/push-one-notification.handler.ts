import { ROLES } from '@app/common/constants/role.constant';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PushOneNotificationByIdCommand } from '../command/push-one-notification.command';
import { INotification } from '../notification.interface';
import { Notification_Type } from '../types';

@CommandHandler(PushOneNotificationByIdCommand)
export class PushOneNotificationByIdHandler
	implements ICommandHandler<PushOneNotificationByIdCommand>
{
	private logger = new Logger(PushOneNotificationByIdHandler.name);
	constructor(private readonly notificationService: INotification) {}
	async execute(command: PushOneNotificationByIdCommand) {
		this.logger.log(command);
		const { user, data } = command;
		const DATA_NOTI: Notification_Type = {
			message: 'Message from admin',
			entity: 'notification',
			entityKind: 'create',
			notiType: 'announcement'
		};

		if (!user) return 'User not found';

		if (user.role.name !== ROLES.ADMIN) return 'User not permission';

		await this.notificationService.sendNotification(DATA_NOTI, user.id, {
			body: data.content
		});

		return 'success';
	}
}
