import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IVerifyUserService } from '../IVerifyUserService.interface';
import { GetAllVerifyUserPaginatedCommand } from '../commands/get-all-verify-user-paginate.command';

@CommandHandler(GetAllVerifyUserPaginatedCommand)
export class GetAllVerifyUserPaginatedHandler
	implements ICommandHandler<GetAllVerifyUserPaginatedCommand>
{
	private logger = new Logger(GetAllVerifyUserPaginatedHandler.name);

	constructor(private readonly verifyUserService: IVerifyUserService) {}

	async execute(command: GetAllVerifyUserPaginatedCommand) {
		this.logger.log(command);
		const { query } = command;
		return this.verifyUserService.getAllPaginated(query);
	}
}
