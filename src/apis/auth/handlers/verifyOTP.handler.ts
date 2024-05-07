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

			if (data.type === OTPType.CONFIRM_ACCOUNT) {
				const currentUser = await UserEntity.findOne({
					where: {
						email: data.email
					}
				});

				const otpBefore = await OTPEntity.findOne({
					where: {
						type: OTPType.CONFIRM_ACCOUNT,
						userId: currentUser?.id,
						expiresAt: MoreThan(new Date())
					}
				});

				if (otpBefore && otpBefore.otp === data.otp) {
					await UserEntity.save({
						id: currentUser?.id,
						isActive: true
					});
					await OTPEntity.remove(otpBefore);

					return 'Xác thực tài khoản thành công!';
				}
			}

			const currentUser = await UserEntity.findOne({
				where: {
					email: data.email
				}
			});

			const isForgottenPassword = await OTPEntity.findOne({
				where: {
					type: OTPType.FORGOT_PASSWORD,
					userId: currentUser?.id
				}
			});

			if (isForgottenPassword && isForgottenPassword.otp === data.otp) {
				await OTPEntity.remove(isForgottenPassword);
				return 'OTP is valid!';
			}

			return 'Mã xác thực không đúng hoặc hết hạn!';
		} catch (error) {
			console.log(error);
			throw new BadRequestException('An error occurred. Please try again!');
		}
	}
}
