import { UserModule } from '@apis/user/user.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { IAuthService } from './auth.interface';
import { AuthService } from './auth.service';
import { LoginHandler } from './handlers/login.handler';
import { RegisterUserHandler } from './handlers/register.handler';
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
		TokenService,

		UserLocalStrategy,
		UserJwtStrategy,

		LoginHandler,
		RegisterUserHandler,
		VerifyUserHandler
	]
})
export class AuthModule {}
