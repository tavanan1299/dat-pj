import { OTPEntity } from '@app/apis/user/entities/otp.entity';
import { UserEntity } from '@app/apis/user/entities/user.entity';
import { IUserService } from '@app/apis/user/user.interface';
import { randomOTP } from '@app/common';
import { IMailService } from '@app/modules/mail';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as uuid from 'uuid';
import { RegisterCommand } from '../commands/register.command';

@CommandHandler(RegisterCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterCommand> {
	private logger = new Logger(RegisterUserHandler.name);

	constructor(
		private readonly userService: IUserService,
		private readonly mailService: IMailService
	) {}

	async execute(command: RegisterCommand) {
		this.logger.debug('execute');
		const { user } = command;

		let userInvite;

		if (user.inviteCode) {
			const userInvite = await UserEntity.findOneBy({ inviteCode: user.inviteCode });

			if (!userInvite) {
				throw new BadRequestException('User Invite Not Found');
			}
		}

		const id = uuid.v4();

		const newUser = await this.userService.create({
			...user,
			inviteCode: id,
			userId: userInvite?.id
		});

		if (newUser) {
			let randomOtp: string = randomOTP(6);

			while (randomOtp) {
				const opt = await OTPEntity.findOne({ where: { otp: +randomOtp } });
				if (!opt) break;
				randomOtp = randomOTP(6);
			}

			const newOTP = OTPEntity.create({
				user: newUser,
				otp: Number(randomOtp)
			});

			await OTPEntity.save(newOTP);

			this.mailService.sendOTP({
				otp: randomOtp,
				to: newUser.email,
				expiresInMinute: 10
			});
		}

		return newUser;
	}
}
