import { ChangePasswordDto } from '../dto/change-password.dto';

export class ChangePasswordCommand {
	data!: ChangePasswordDto & { user: Record<string, any> };

	constructor(data: ChangePasswordCommand) {
		Object.assign(this, data);
	}
}
