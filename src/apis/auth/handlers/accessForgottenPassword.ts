import { OTPEntity } from '@app/apis/user/entities/otp.entity';
import { UserEntity } from '@app/apis/user/entities/user.entity';
import { IUserService } from '@app/apis/user/user.interface';
import { OTPType } from '@app/common/enums/otpType.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { hash } from 'argon2';
import { AccessForgottenPasswordCommand } from '../commands/accessForgottenPassword.command';

@CommandHandler(AccessForgottenPasswordCommand)
export class AccessForgottenPasswordHandler
	implements ICommandHandler<AccessForgottenPasswordCommand>
{
	private logger = new Logger(AccessForgottenPasswordHandler.name);

	constructor(private readonly userService: IUserService) {}

	async execute(command: AccessForgottenPasswordCommand) {
		try {
			this.logger.debug('execute');
			const { data } = command;
			//
			const currentUser = await UserEntity.findOne({
				where: {
					email: data.email
				}
			});
			if (!currentUser) {
				throw new BadRequestException('User not found.');
			}
			//
			const isForgottenPassword = await OTPEntity.findOne({
				where: {
					type: OTPType.FORGOT_PASSWORD,
					userId: currentUser?.id
				}
			});
			//
			if (isForgottenPassword && isForgottenPassword.otp === data.otp) {
				const hashedPassword = await hash(data.newPassword);
				currentUser.password = hashedPassword;
				await currentUser.save();
				await OTPEntity.remove(isForgottenPassword);
				return 'Access forgotten password sussces!';
			}
			//
			return 'OTP is not valid!';
		} catch (error) {
			throw new BadRequestException('An error occurred. Please try again!');
		}
	}
}
