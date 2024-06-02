import { IStacking } from '@app/apis/stacking/stacking.interface';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetMyStacksCommand } from '../commands/get-my-stacks.command';

@CommandHandler(GetMyStacksCommand)
export class GetMyStacksHandler implements ICommandHandler<GetMyStacksCommand> {
	private logger = new Logger(GetMyStacksHandler.name);

	constructor(private readonly stackingService: IStacking) {}

	async execute(command: GetMyStacksCommand) {
		this.logger.log(command);
		const { query, user } = command;
		const queryParams: any = { ...query };

		queryParams.where = { userId: user.id };
		return this.stackingService.getAllPaginated(queryParams);
	}
}
