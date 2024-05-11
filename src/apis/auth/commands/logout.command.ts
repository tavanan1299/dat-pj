import { LogoutDto } from '../dto/logout.dto';

export class LogoutCommand {
	data!: LogoutDto & { user: Record<string, any> };

	constructor(data: LogoutCommand) {
		Object.assign(this, data);
	}
}
