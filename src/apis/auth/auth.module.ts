import { UserModule } from '@apis/user/user.module';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/guards/role.guard';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { IAuthService } from './auth.interface';
import { AuthService } from './auth.service';
import { PermissionEntity } from './entities/permission.entity';
import { RoleEntity } from './entities/role.entity';
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
	imports: [
		PassportModule,
		UserModule,
		TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity])
	],
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
		{
			provide: APP_GUARD,
			useClass: RolesGuard
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
