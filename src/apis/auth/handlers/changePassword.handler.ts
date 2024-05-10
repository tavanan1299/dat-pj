import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { hash, verify } from 'argon2';
import { ChangePasswordCommand } from '../commands/changePassword.command';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
	private logger = new Logger(ChangePasswordHandler.name);

	constructor() {}

	async execute(command: ChangePasswordCommand) {
		try {
			this.logger.debug('execute');
			const { data } = command;

			const user = await UserEntity.findOne({ where: { id: data.user.id } });
			if (!user) {
				throw new BadRequestException('User not found.');
			}

			const isCurrentPasswordValid = await verify(user.password, data.currentPassword);
			if (!isCurrentPasswordValid) {
				throw new BadRequestException('Current password is incorrect.');
			}

			if (data.currentPassword === data.newPassword) {
				throw new BadRequestException(
					'New password must be different from the current password.'
				);
			}

			const hashedPassword = await hash(data.newPassword);
			user.password = hashedPassword;

			await user.save();
			return 'Reset password success';
		} catch (error: any) {
			throw new BadRequestException(error.message);
		}
	}
}
