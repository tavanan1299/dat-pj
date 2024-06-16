import { IFutureCommand } from '@app/apis/command/future-command.interface';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetMyFutureCommandCommand } from '../commands/get-my-future-command.command';

@CommandHandler(GetMyFutureCommandCommand)
export class GetMyFutureCommandHandler implements ICommandHandler<GetMyFutureCommandCommand> {
	private logger = new Logger(GetMyFutureCommandHandler.name);

	constructor(private readonly futureCommandService: IFutureCommand) {}

	async execute(command: GetMyFutureCommandCommand) {
		this.logger.log(command);
		const { query, user } = command;
		const queryParams: any = { ...query };

		queryParams.where = { userId: user.id };
		return this.futureCommandService.getAllPaginated(queryParams);
	}
}
