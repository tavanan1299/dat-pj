import { UserModule } from '@apis/user/user.module';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { IAuthService } from './auth.interface';
import { AuthService } from './auth.service';
import { ChangePasswordHandler } from './handlers/changePassword.handler';
import { ForgotPasswordHandler } from './handlers/forgotPassword.handler';
import { LoginHandler } from './handlers/login.handler';
import { LogoutHandler } from './handlers/logout.handler';
import { RegisterUserHandler } from './handlers/register.handler';
import { ResetPasswordHandler } from './handlers/resetPassword.handler';
import { VerifyUserHandler } from './handlers/verifyOTP.handler';
import { UserJwtStrategy } from './strategies/jwt/user.jwt.strategy';
import { UserLocalStrategy } from './strategies/local/user.local.strategy';
import { TokenService } from './token.service';

@Module({
	imports: [PassportModule, UserModule],
	controllers: [AuthController],
	providers: [
		{
			provide: IAuthService,
			useClass: AuthService
		},
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		},
		TokenService,

		UserLocalStrategy,
		UserJwtStrategy,

		LoginHandler,
		RegisterUserHandler,
		VerifyUserHandler,
		ForgotPasswordHandler,
		ResetPasswordHandler,
		ChangePasswordHandler,
		LogoutHandler
	]
})
export class AuthModule {}
