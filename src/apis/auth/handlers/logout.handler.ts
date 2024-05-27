import { RefreshTokenEntity } from '@app/apis/user/entities/refreshToken.entity';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { In, LessThanOrEqual } from 'typeorm';
import { LogoutCommand } from '../commands/logout.command';
const sha1 = require('sha1');

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
	private logger = new Logger(LogoutHandler.name);

	constructor(private configService: ConfigService) {}

	async execute(command: LogoutCommand) {
		this.logger.debug('execute');
		const { data } = command;

		const hashToken = await sha1(data.refreshToken);

		const token = await RefreshTokenEntity.findOne({
			where: { userId: data.user.id, refresh: hashToken }
		});

		if (token) {
			await RefreshTokenEntity.delete(token.id);

			const outdatedRF = await RefreshTokenEntity.find({
				where: {
					userId: data.user.id,
					createdAt: LessThanOrEqual(
						new Date(
							Date.now() -
								parseInt(
									this.configService.get('REFRESH_TOKEN_EXPIRES_IN') as string
								) *
									1000
						)
					)
				}
			});
			await RefreshTokenEntity.delete({ id: In(outdatedRF.map((rf) => rf.id)) });
		}

		return 'Logout successfully';
	}
}
