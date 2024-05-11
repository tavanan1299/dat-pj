import { AuthStrategy } from '@apis/auth/auth.const';
import { IAuthService } from '@apis/auth/auth.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(Strategy, AuthStrategy.USER_LOCAL) {
	constructor(private authService: IAuthService) {
		super({
			usernameField: 'email',
			passwordField: 'password'
		});
	}

	async validate(email: string, password: string) {
		const service = this.authService.getService('user');
		return service.validateUserByEmailPassword(email, password);
	}
}
