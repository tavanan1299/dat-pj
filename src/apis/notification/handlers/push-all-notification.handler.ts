import { ROLES } from '@app/common/constants/role.constant';
import { InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Queue } from 'bullmq';
import { PushAllNotificationCommand } from '../command/push-all-notification.command';

@CommandHandler(PushAllNotificationCommand)
export class PushNotificationToAllUsersHandler
	implements ICommandHandler<PushAllNotificationCommand>
{
	private logger = new Logger(PushNotificationToAllUsersHandler.name);

	constructor(
		@InjectQueue('notification')
		private readonly sendNotificationAllUser: Queue
	) {}

	async execute(command: PushAllNotificationCommand) {
		this.logger.log(command);
		const { data, user } = command;

		if (!user) return 'User not found';

		if (user.role.name !== ROLES.ADMIN) return 'User not permission';

		await this.sendNotificationAllUser.add('sendNotification', data);
		return 'success';
	}
}
