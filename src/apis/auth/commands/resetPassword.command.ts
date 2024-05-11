import { ResetPasswordDto } from '../dto/reset-password.dto';

export class ResetPasswordCommand {
	data!: ResetPasswordDto;

	constructor(data: ResetPasswordCommand) {
		Object.assign(this, data);
	}
}
