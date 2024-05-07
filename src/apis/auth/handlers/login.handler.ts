import { RefreshTokenEntity } from '@app/apis/user/entities/refreshToken.entity';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { In, LessThanOrEqual } from 'typeorm';
import { LoginCommand } from '../commands/login.command';
import { TokenService } from '../token.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
	private logger = new Logger(LoginHandler.name);

	constructor(
		private readonly tokenService: TokenService,
		private configService: ConfigService
	) {}

	async execute(command: LoginCommand) {
		this.logger.debug('execute');
		const { user } = command;
		const payload: JwtPayload = {
			id: user.id
		};

		const data = await this.tokenService.generateAuthToken(payload);

		const newRT = RefreshTokenEntity.create({
			user,
			refresh: data.refreshToken
		});

		await RefreshTokenEntity.save(newRT);

		const outdatedRF = await RefreshTokenEntity.find({
			where: {
				userId: user.id,
				createdAt: LessThanOrEqual(
					new Date(
						Date.now() -
							parseInt(this.configService.get('REFRESH_TOKEN_EXPIRES_IN') as string) *
								1000
					)
				)
			}
		});
		await RefreshTokenEntity.delete({ id: In(outdatedRF.map((rf) => rf.id)) });

		return data;
	}
}
