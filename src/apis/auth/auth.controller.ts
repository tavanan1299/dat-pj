import { UserEntity } from '@apis/user/entities/user.entity';
import { SkipAuth } from '@app/common/guards/skip-auth.guard';
import { ApiController, UseUserGuard, User } from '@common';
import { Body, Controller, HttpCode, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthStrategy } from './auth.const';
import { ChangePasswordCommand } from './commands/changePassword.command';
import { ForgotPasswordCommand } from './commands/forgotPassword.command';
import { LoginCommand } from './commands/login.command';
import { RegisterCommand } from './commands/register.command';
import { ResetPasswordCommand } from './commands/resetPassword.command';
import { VerifyCommand } from './commands/verifyOTP.command';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
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
	@ApiOperation({ description: 'Login' })
	@ApiOkResponse({ description: 'Login successfully' })
	@UseGuards(AuthGuard(AuthStrategy.USER_LOCAL))
	@Post('user/login')
	@HttpCode(200)
	loginUser(@Body() _loginUserDto: LoginUserDto, @User() user: UserEntity) {
		return this.commandBus.execute(new LoginCommand({ user }));
	}

	@SkipAuth()
	@ApiOperation({ description: 'Register' })
	@ApiOkResponse({ description: 'Register successfully' })
	@Post('user/register')
	@HttpCode(200)
	registerUser(@Body() _registerUserDto: RegisterUserDto) {
		return this.commandBus.execute(new RegisterCommand({ user: _registerUserDto }));
	}

	@SkipAuth()
	@ApiOperation({ description: 'Rotate token' })
	@ApiOkResponse({ description: 'Rotate token successfully' })
	@Post('/token/refresh')
	@HttpCode(200)
	async getNewToken(
		@Body(ValidationPipe) refreshTokenDto: RefreshTokenRequestDto
	): Promise<TokenDto> {
		const { refreshToken } = refreshTokenDto;
		return this.tokenService.generateRefreshToken(refreshToken);
	}

	@SkipAuth()
	@ApiOperation({ description: 'Verify opt' })
	@ApiOkResponse({ description: 'Verify opt successfully' })
	@Post('verify')
	@HttpCode(200)
	verify(@Body() otpDto: VerifyDto) {
		return this.commandBus.execute(new VerifyCommand({ data: otpDto }));
	}

	@SkipAuth()
	@ApiOperation({ description: 'Forgot password' })
	@ApiOkResponse({ description: 'Forgot password successfully' })
	@Post('forgot-password')
	@HttpCode(200)
	forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
		return this.commandBus.execute(new ForgotPasswordCommand({ data: forgotPasswordDto }));
	}

	@SkipAuth()
	@ApiOperation({ description: 'Reset password' })
	@ApiOkResponse({ description: 'Reset password successfully' })
	@Post('reset-password')
	@HttpCode(200)
	resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.commandBus.execute(new ResetPasswordCommand({ data: resetPasswordDto }));
	}

	@ApiOperation({ description: 'Change password' })
	@ApiOkResponse({ description: 'Change password successfully' })
	@Post('change-password')
	@UseUserGuard()
	@HttpCode(200)
	changePassword(
		@Body() changePasswordDto: ChangePasswordDto,
		@User() user: Record<string, any>
	) {
		return this.commandBus.execute(
			new ChangePasswordCommand({ data: { ...changePasswordDto, user } })
		);
	}
}
