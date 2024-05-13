import { OTPEntity } from '@app/apis/user/entities/otp.entity';
import { IUserService } from '@app/apis/user/user.interface';
import { randomOTP } from '@app/common';
import { OTPType } from '@app/common/enums/otpType.enum';
import { IMailService } from '@app/modules/mail';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForgotPasswordCommand } from '../commands/forgotPassword.command';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
	private logger = new Logger(ForgotPasswordHandler.name);

	constructor(
		private readonly userService: IUserService,
		private readonly mailService: IMailService
	) {}

	async execute(command: ForgotPasswordCommand) {
		try {
			this.logger.debug('execute');
			const { data } = command;

			const user = await this.userService.getOne({ where: { email: data.email } });

			if (!user) {
				throw new BadRequestException(`Email: ${data.email} is not exist is our system`);
			}

			if (user) {
				let randomOtp: string = randomOTP(6);
				while (randomOtp) {
					const opt = await OTPEntity.findOne({ where: { otp: +randomOtp } });
					if (!opt) break;
					randomOtp = randomOTP(6);
				}

				const newOTP = OTPEntity.create({
					userId: user.id,
					type: OTPType.FORGOT_PASSWORD,
					otp: Number(randomOtp)
				});

				await OTPEntity.save(newOTP);

				this.mailService.sendOTP({
					otp: randomOtp,
					to: user.email,
					expiresInMinute: 10
				});
			}

			return true;
		} catch (error: any) {
			throw new BadRequestException(error.message);
		}
	}
}
