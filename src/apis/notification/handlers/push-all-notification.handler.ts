import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PushAllNotificationCommand } from '../command/push-all-notification.command';
import { INotification } from '../notification.interface';

@CommandHandler(PushAllNotificationCommand)
export class PushNotificationToAllUsersHandler
	implements ICommandHandler<PushAllNotificationCommand>
{
	private logger = new Logger(PushNotificationToAllUsersHandler.name);

	constructor(private readonly NotificationService: INotification) {}

	async execute(command: PushAllNotificationCommand) {
		this.logger.log(command);
		const { data } = command;

		await this.NotificationService.sendNotificationToAllUsers(data);
		return 'success';
	}
}
