import { UserModule } from '@apis/user/user.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { IAuthService } from './auth.interface';
import { AuthService } from './auth.service';
import { ForgottenPasswordHandler } from './handlers/forgottenPassword.handler';
import { LoginHandler } from './handlers/login.handler';
import { RegisterUserHandler } from './handlers/register.handler';
import { ResetPasswordHandler } from './handlers/resetPassword.handler';
import { VerifyUserHandler } from './handlers/verifyOTP.handler';
import { UserJwtStrategy } from './strategies/jwt/user.jwt.strategy';
import { UserLocalStrategy } from './strategies/local/user.local.strategy';

@Module({
	imports: [PassportModule, UserModule],
	controllers: [AuthController],
	providers: [
		{
			provide: IAuthService,
			useClass: AuthService
		},

		UserLocalStrategy,
		UserJwtStrategy,

		LoginHandler,
		RegisterUserHandler,
		VerifyUserHandler,
		ResetPasswordHandler,
		ForgottenPasswordHandler
	]
})
export class AuthModule {}
