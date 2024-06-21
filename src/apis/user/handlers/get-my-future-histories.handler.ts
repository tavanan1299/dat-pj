import { IFutureCommandLog } from '@app/apis/log/future-command-log/future-command-log.interface';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetMyFutureHistoriesCommand } from '../commands/get-my-future-histories.command';

@CommandHandler(GetMyFutureHistoriesCommand)
export class GetMyFutureHistoriesHandler implements ICommandHandler<GetMyFutureHistoriesCommand> {
	private logger = new Logger(GetMyFutureHistoriesHandler.name);

	constructor(private readonly futureCommandLogService: IFutureCommandLog) {}

	async execute(command: GetMyFutureHistoriesCommand) {
		this.logger.log(command);
		const { query, user } = command;
		const queryParams: any = { ...query };

		queryParams.where = { userId: user.id };
		return this.futureCommandLogService.getAllPaginated(queryParams);
	}
}
