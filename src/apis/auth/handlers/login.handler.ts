import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { TokenService } from '../token.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
	private logger = new Logger(LoginHandler.name);

	constructor(private readonly tokenService: TokenService) {}

	async execute(command: LoginCommand) {
		this.logger.debug('execute');
		const { user } = command;
		const payload: JwtPayload = {
			id: user.id
		};

		const accessToken = await this.tokenService.generateAuthToken(payload);
		return accessToken;
	}
}
