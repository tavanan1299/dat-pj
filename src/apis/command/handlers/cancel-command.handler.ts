import { ROLES } from '@app/common/constants/role.constant';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../command.interface';
import { CancelCommand } from '../commands/cancel-command.command';
import { CommandEntity } from '../entities/command.entity';

@CommandHandler(CancelCommand)
export class CancelCommandHandler implements ICommandHandler<CancelCommand> {
	private logger = new Logger(CancelCommandHandler.name);

	constructor(private readonly commandService: ICommand) {}

	async execute(command: CancelCommand) {
		this.logger.debug('execute');

		const { commandId, user } = command;

		try {
			const curentCommand = await CommandEntity.findOneBy({
				id: commandId
			});

			if (!curentCommand) {
				throw new BadRequestException('Command not found');
			}

			if (curentCommand.userId === user.id || user.role.name === ROLES.ADMIN) {
				await CommandEntity.remove(curentCommand);
				return 'Cancel Command successfully';
			}

			throw new BadRequestException('Access denied');
		} catch (error) {
			throw error;
		}
	}
}
