import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetAllNotificationPaginatedCommand } from '../command/get-all-notification.command';
import { NotificationReceives } from '../entities/notification-receive.entity';

@CommandHandler(GetAllNotificationPaginatedCommand)
export class GetAllPaginationPaginatedHandler
	implements ICommandHandler<GetAllNotificationPaginatedCommand>
{
	private logger = new Logger(GetAllPaginationPaginatedHandler.name);

	async execute(command: GetAllNotificationPaginatedCommand) {
		this.logger.log(command);
		const { query, user } = command;
		const { limit = 10, page = 1, order } = query;
		const take = limit === -1 ? undefined : limit;
		const skip = limit === -1 ? undefined : limit * (+page - 1);

		const [data, total] = await NotificationReceives.findAndCount({
			where: {
				userId: user.id
			},
			relations: ['notification'],
			take,
			skip,
			order
		});

		return {
			data,
			pagination: {
				limit: limit === -1 ? total : limit,
				page: limit === -1 ? 1 : page,
				total
			}
		};
	}
}
