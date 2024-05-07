import { OTPEntity } from '@app/apis/user/entities/otp.entity';
import { IUserService } from '@app/apis/user/user.interface';
import { randomOTP } from '@app/common';
import { IMailService } from '@app/modules/mail';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../commands/register.command';

@CommandHandler(RegisterCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterCommand> {
	private logger = new Logger(RegisterUserHandler.name);

	constructor(
		private readonly userService: IUserService,
		private readonly mailService: IMailService
	) {}

	async execute(command: RegisterCommand) {
		try {
			this.logger.debug('execute');
			const { user } = command;
			const newUser = await this.userService.create(user);

			if (newUser) {
				const randomOtp = randomOTP(6);
				const newOTP = OTPEntity.create({
					user: newUser,
					otp: Number(randomOtp)
				});

				await OTPEntity.save(newOTP);

				await this.mailService.sendOTP({
					otp: randomOtp,
					to: newUser.email,
					expiresInMinute: 10
				});
			}

			return newUser;
		} catch (error) {
			throw new BadRequestException('An error occurred. Please try again!');
		}
	}
}
