import { ForgottenPasswordDto } from '../dto/forgotten-password.dto';

export class ForgottenPasswordCommand {
	data!: ForgottenPasswordDto;

	constructor(data: ForgottenPasswordCommand) {
		Object.assign(this, data);
	}
}
