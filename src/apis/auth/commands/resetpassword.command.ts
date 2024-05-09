import { ResetPasswordDto } from '../dto/reset-password.dto';

export class ResetPasswordCommand {
	data!: ResetPasswordDto & { user: Record<string, any> };

	constructor(data: ResetPasswordCommand) {
		Object.assign(this, data);
	}
}
