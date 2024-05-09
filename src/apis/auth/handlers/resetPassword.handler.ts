import { UserEntity } from '@app/apis/user/entities/user.entity';
import { IUserService } from '@app/apis/user/user.interface';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { hash, verify } from 'argon2';
import { ResetPasswordCommand } from '../commands/resetpassword.command';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
	private logger = new Logger(ResetPasswordHandler.name);

	constructor(private readonly userService: IUserService) {}

	async execute(command: ResetPasswordCommand) {
		try {
			this.logger.debug('execute');
			const { data } = command;
			//
			const user = await UserEntity.findOne({ where: { email: data.email } });
			if (!user) {
				throw new BadRequestException('User not found.');
			}
			//
			const isCurrentPasswordValid = await verify(user.password, data.currentPassword);
			if (!isCurrentPasswordValid) {
				throw new BadRequestException('Current password is incorrect.');
			}
			//
			if (data.currentPassword === data.newPassword) {
				throw new BadRequestException(
					'New password must be different from the current password.'
				);
			}
			//
			const hashedPassword = await hash(data.newPassword);
			user.password = hashedPassword;
			//
			await user.save();
			return 'Reset password sussces';
		} catch (error) {
			console.log(error);
			throw new BadRequestException('An error occurred. Please try again!');
		}
	}
}
