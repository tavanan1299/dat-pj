import { OTPEntity } from '@app/apis/user/entities/otp.entity';
import { UserEntity } from '@app/apis/user/entities/user.entity';
import { IUserService } from '@app/apis/user/user.interface';
import { inviteCode, randomOTP } from '@app/common';
import { ROLES } from '@app/common/constants/role.constant';
import { IMailService } from '@app/modules/mail';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { hash } from 'argon2';
import { RegisterCommand } from '../commands/register.command';
import { RoleEntity } from '../entities/role.entity';

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
			userInvite = await UserEntity.findOneBy({ inviteCode: user.inviteCode });

			if (!userInvite) {
				throw new BadRequestException('User Invite Not Found');
			}
		}

		const ivCode = inviteCode(8);

		const curUser = await UserEntity.findOneBy({ email: user.email });
		if (curUser) {
			if (!curUser.isActive) {
				await this.sendOtp(curUser);

				await this.userService.updateById(curUser.id, {
					...user,
					inviteCode: ivCode,
					password: await hash(user.password),
					userId: userInvite?.id
				});

				return 'Please check your email to verify your registration';
			}
			throw new BadRequestException('User already exists');
		}

		const basisRole = await RoleEntity.findOne({ where: { name: ROLES.BASIC } });

		const newUser = await this.userService.create({
			...user,
			inviteCode: ivCode,
			userId: userInvite?.id,
			roleId: basisRole?.id
		});

		if (newUser) {
			await this.sendOtp(newUser);
		}

		return newUser;
	}

	async sendOtp(user: UserEntity) {
		let randomOtp: string = randomOTP(6);

		while (randomOtp) {
			const opt = await OTPEntity.findOne({ where: { otp: +randomOtp } });
			if (!opt) break;
			randomOtp = randomOTP(6);
		}

		const newOTP = OTPEntity.create({
			user: user,
			otp: Number(randomOtp)
		});

		await OTPEntity.save(newOTP);

		this.mailService.sendOTP({
			otp: randomOtp,
			to: user.email,
			expiresInMinute: 10
		});
	}
}
