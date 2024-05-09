import { AccessForgottenPasswordDto } from '../dto/access-forgotten-password.dto';

export class AccessForgottenPasswordCommand {
	data!: AccessForgottenPasswordDto;

	constructor(data: AccessForgottenPasswordCommand) {
		Object.assign(this, data);
	}
}
