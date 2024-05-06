import { UserModule } from '@apis/user/user.module';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
		ResetPasswordHandler,
		ForgottenPasswordHandler
	]
})
export class AuthModule {}
