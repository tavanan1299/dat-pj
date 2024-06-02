import { OTPEntity } from '@app/apis/user/entities/otp.entity';
import { UserEntity } from '@app/apis/user/entities/user.entity';
import { OTPType } from '@app/common/enums/otpType.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { hash } from 'argon2';
import { MoreThan } from 'typeorm';
import { ResetPasswordCommand } from '../commands/resetPassword.command';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
	private logger = new Logger(ResetPasswordHandler.name);

	constructor() {}

	async execute(command: ResetPasswordCommand) {
		try {
			this.logger.debug('execute');
			const { data } = command;

			const currentUser = await UserEntity.findOne({
				where: {
					email: data.email
				}
			});

			const otpBefore = await OTPEntity.findOne({
				where: {
					type: OTPType.FORGOT_PASSWORD,
					userId: currentUser?.id,
					expiresAt: MoreThan(new Date()),
					isActive: true
				}
			});

			if (otpBefore) {
				await UserEntity.save({
					id: otpBefore.userId,
					password: await hash(data.password)
				});

				await OTPEntity.remove(otpBefore);

				return 'Reset password successfully!';
			}

			throw new BadRequestException('OTP code is invalid or expired!');
		} catch (error) {
			throw new BadRequestException('An error occurred. Please try again!');
		}
	}
}
