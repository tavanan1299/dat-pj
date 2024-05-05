import { UserEntity } from '@apis/user/entities/user.entity';
import { ApiController, User } from '@common';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from './auth.const';
import { ApiLogin } from './auth.swagger';
import { LoginCommand } from './commands/login.command';
import { RegisterCommand } from './commands/register.command';
import { VerifyCommand } from './commands/verifyOTP.command';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
@ApiController('Auth')
export class AuthController {
	constructor(private readonly commandBus: CommandBus) {}

	@UseGuards(AuthGuard(AuthStrategy.USER_LOCAL))
	@Post('user/login')
	@HttpCode(200)
	@ApiLogin('user')
	loginUser(@Body() _loginUserDto: LoginUserDto, @User() user: UserEntity) {
		return this.commandBus.execute(new LoginCommand({ user }));
	}

	@Post('user/register')
	@HttpCode(200)
	registerUser(@Body() _registerUserDto: RegisterUserDto) {
		return this.commandBus.execute(new RegisterCommand({ user: _registerUserDto }));
	}

	@Post('verify')
	@HttpCode(200)
	verify(@Body() otpDto: VerifyDto) {
		return this.commandBus.execute(new VerifyCommand({ data: otpDto }));
	}
}
