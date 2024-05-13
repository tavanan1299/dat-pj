import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IVerifyUserService } from '../IVerifyUserService.interface';
import { ApproveVerifyUserCommand } from '../commands/approve-verify-user.command';

@CommandHandler(ApproveVerifyUserCommand)
export class ApproveVerifyUserHandler implements ICommandHandler<ApproveVerifyUserCommand> {
	private logger = new Logger(ApproveVerifyUserHandler.name);

	constructor(private readonly verifyUserService: IVerifyUserService) {}

	async execute(command: ApproveVerifyUserCommand) {
		this.logger.log(command);
		const { id } = command;
		await this.verifyUserService.getOneByIdOrFail(id);

		await this.verifyUserService.updateById(id, { isVerified: true });

		return 'Approved verify user success';
	}
}
