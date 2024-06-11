import { LoginUserDto } from '../dto/login-user.dto';

export class LoginCommand {
	user!: User;
	data!: LoginUserDto;
	fcmToken!: string;

	constructor(data: LoginCommand) {
		Object.assign(this, data);
	}
}
