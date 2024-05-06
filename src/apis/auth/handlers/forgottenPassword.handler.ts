import { OTPEntity } from '@app/apis/user/entities/otp.entity';
import { UserEntity } from '@app/apis/user/entities/user.entity';
import { IUserService } from '@app/apis/user/user.interface';
import { randomOTP } from '@app/common';
import { OTPType } from '@app/common/enums/otpType.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForgottenPasswordCommand } from '../commands/forgottenPassword.command';

@CommandHandler(ForgottenPasswordCommand)
export class ForgottenPasswordHandler implements ICommandHandler<ForgottenPasswordCommand> {
	private readonly logger = new Logger(ForgottenPasswordHandler.name);

	constructor(private readonly userService: IUserService) {}

	async execute(command: ForgottenPasswordCommand) {
		try {
			this.logger.debug('execute');
			const { data } = command;

			const userForgottenPassword = await UserEntity.findOne({
				where: { email: data.email }
			});

			if (!userForgottenPassword) {
				throw new BadRequestException('User not found.');
			}

			await OTPEntity.delete({ userId: data.id, type: OTPType.FORGOT_PASSWORD });

			const randomOtp = randomOTP(6);
			const newOTP = OTPEntity.create({
				user: userForgottenPassword,
				otp: Number(randomOtp),
				type: OTPType.FORGOT_PASSWORD
			});
			await OTPEntity.save(newOTP);
			return newOTP;
		} catch (error) {
			throw new BadRequestException('An error occurred. Please try again!');
		}
	}
}
