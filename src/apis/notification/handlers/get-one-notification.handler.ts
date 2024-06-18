import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetOneNotificationByIdCommand } from '../command/get-onenotification.command';
import { NotificationReceives } from '../entities/notification-receive.entity';

@CommandHandler(GetOneNotificationByIdCommand)
export class GetOneNotificationByIdHandler
	implements ICommandHandler<GetOneNotificationByIdCommand>
{
	private logger = new Logger(GetOneNotificationByIdHandler.name);

	async execute(command: GetOneNotificationByIdCommand): Promise<NotificationReceives> {
		this.logger.log(command);
		const { id, user } = command;

		const notifcation = await NotificationReceives.findOne({
			where: {
				userId: user.id,
				id
			},
			relations: ['notification']
		});

		if (!notifcation) throw new NotFoundException('Notification does not exist');

		return notifcation;
	}
}
