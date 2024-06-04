import { ICommandLog } from '@app/apis/log/command-log/command-log.interface';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetMySpotHistoriesCommand } from '../commands/get-my-spot-histories.command';

@CommandHandler(GetMySpotHistoriesCommand)
export class GetMySpotHistoriesHandler implements ICommandHandler<GetMySpotHistoriesCommand> {
	private logger = new Logger(GetMySpotHistoriesHandler.name);

	constructor(private readonly commandLogService: ICommandLog) {}

	async execute(command: GetMySpotHistoriesCommand) {
		this.logger.log(command);
		const { query, user } = command;
		const queryParams: any = { ...query };

		queryParams.where = { userId: user.id };

		return this.commandLogService.getAllPaginated(queryParams);
	}
}
