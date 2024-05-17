import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IVerifyUserService } from '../IVerifyUserService.interface';
import { GetOneVerifyUserByIdCommand } from '../commands/get-one-verify-user.command';

@CommandHandler(GetOneVerifyUserByIdCommand)
export class GetOneVerifyUserByIdHandler implements ICommandHandler<GetOneVerifyUserByIdCommand> {
	private logger = new Logger(GetOneVerifyUserByIdHandler.name);

	constructor(private readonly verifyUserService: IVerifyUserService) {}

	async execute(command: GetOneVerifyUserByIdCommand) {
		this.logger.log(command);
		const { id } = command;
		return this.verifyUserService.getOneByIdOrFail(id, { relations: ['user'] });
	}
}
