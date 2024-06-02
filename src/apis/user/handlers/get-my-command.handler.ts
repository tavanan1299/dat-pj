import { ICommand } from '@app/apis/command/command.interface';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetMyCommandCommand } from '../commands/get-my-command.command';

@CommandHandler(GetMyCommandCommand)
export class GetMyCommandHandler implements ICommandHandler<GetMyCommandCommand> {
	private logger = new Logger(GetMyCommandHandler.name);

	constructor(private readonly commandService: ICommand) {}

	async execute(command: GetMyCommandCommand) {
		this.logger.log(command);
		const { query, user } = command;
		const queryParams: any = { ...query };

		queryParams.where = { userId: user.id };
		return this.commandService.getAllPaginated(queryParams);
	}
}
