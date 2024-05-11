import { RegisterUserDto } from '../dto/register-user.dto';

export class RegisterCommand {
	user!: RegisterUserDto;

	constructor(data: RegisterCommand) {
		Object.assign(this, data);
	}
}
