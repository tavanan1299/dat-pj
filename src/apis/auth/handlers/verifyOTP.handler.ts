import { OTPEntity } from '@app/apis/user/entities/otp.entity';
import { UserEntity } from '@app/apis/user/entities/user.entity';
import { IUserService } from '@app/apis/user/user.interface';
import { OTPType } from '@app/common/enums/otpType.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MoreThan } from 'typeorm';
import { VerifyCommand } from '../commands/verifyOTP.command';

@CommandHandler(VerifyCommand)
export class VerifyUserHandler implements ICommandHandler<VerifyCommand> {
	private logger = new Logger(VerifyUserHandler.name);

	constructor(private readonly userService: IUserService) {}

	async execute(command: VerifyCommand) {
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
					userId: currentUser?.id,
					expiresAt: MoreThan(new Date()),
					otp: data.otp
				}
			});

			if (otpBefore) {
				await OTPEntity.save({
					id: otpBefore.id,
					isActive: true
				});

				if (otpBefore.type === OTPType.CONFIRM_ACCOUNT) {
					await UserEntity.save({
						id: currentUser?.id,
						isActive: true
					});

					await OTPEntity.remove(otpBefore);
				}

				return 'Verify successfully!';
			}

			return 'OTP code is invalid or expired!';
		} catch (error) {
			throw new BadRequestException('An error occurred. Please try again!');
		}
	}
}
