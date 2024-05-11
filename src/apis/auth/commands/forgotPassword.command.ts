import { ForgotPasswordDto } from '../dto/forgot-password.dto';

export class ForgotPasswordCommand {
	data!: ForgotPasswordDto;

	constructor(data: ForgotPasswordCommand) {
		Object.assign(this, data);
	}
}
