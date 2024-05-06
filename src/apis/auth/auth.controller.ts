import { UserEntity } from '@apis/user/entities/user.entity';
import { SkipAuth } from '@app/common/guards/skip-auth.guard';
import { ApiController, User } from '@common';
import { Body, Controller, HttpCode, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthStrategy } from './auth.const';
import { ApiLogin } from './auth.swagger';
import { ForgottenPasswordCommand } from './commands/forgottenPassword.command';
import { LoginCommand } from './commands/login.command';
import { RegisterCommand } from './commands/register.command';
import { ResetPasswordCommand } from './commands/resetpassword.command';
import { VerifyCommand } from './commands/verifyOTP.command';
import { ForgottenPasswordDto } from './dto/forgotten-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenDto } from './dto/token.dto';
import { VerifyDto } from './dto/verify.dto';
import { TokenService } from './token.service';

@Controller('auth')
@ApiController('Auth')
export class AuthController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly tokenService: TokenService
	) {}

	@SkipAuth()
	@UseGuards(AuthGuard(AuthStrategy.USER_LOCAL))
	@Post('user/login')
	@HttpCode(200)
	@ApiLogin('user')
	loginUser(@Body() _loginUserDto: LoginUserDto, @User() user: UserEntity) {
		return this.commandBus.execute(new LoginCommand({ user }));
	}
	@SkipAuth()
	@Post('user/register')
	@HttpCode(200)
	registerUser(@Body() _registerUserDto: RegisterUserDto) {
		return this.commandBus.execute(new RegisterCommand({ user: _registerUserDto }));
	}

	@SkipAuth()
	@ApiOperation({ description: 'Renew access in the application' })
	@ApiOkResponse({ description: 'token successfully renewed' })
	@ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
	@Post('/token/refresh')
	async getNewToken(
		@Body(ValidationPipe) refreshTokenDto: RefreshTokenRequestDto
	): Promise<TokenDto> {
		const { refreshToken } = refreshTokenDto;
		return this.tokenService.generateRefreshToken(refreshToken);
	}

	@SkipAuth()
	@Post('verify')
	@HttpCode(200)
	verify(@Body() otpDto: VerifyDto) {
		return this.commandBus.execute(new VerifyCommand({ data: otpDto }));
	}

	@Post('resetPassword')
	@HttpCode(200)
	resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.commandBus.execute(new ResetPasswordCommand({ data: resetPasswordDto }));
	}

	@Post('forgottenPassword')
	@HttpCode(200)
	forgottenPassword(@Body() forgottenPassword: ForgottenPasswordDto) {
		return this.commandBus.execute(new ForgottenPasswordCommand({ data: forgottenPassword }));
	}
}
