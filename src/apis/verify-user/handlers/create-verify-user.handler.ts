import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IVerifyUserService } from '../IVerifyUserService.interface';
import { CreateVerifyUserCommand } from '../commands/create-verify-user.command';

@CommandHandler(CreateVerifyUserCommand)
export class CreateVerifyUserHandler implements ICommandHandler<CreateVerifyUserCommand> {
	private logger = new Logger(CreateVerifyUserHandler.name);

	constructor(private readonly verifyUserService: IVerifyUserService) {}

	async execute(command: CreateVerifyUserCommand) {
		this.logger.debug('execute');
		const { data, user } = command;
		await this.verifyUserService.create({ ...data, userId: user.id });

		return 'Create verify user successfully';
	}
}
