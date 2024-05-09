import { IsEmail, IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
	@ApiProperty({ description: 'Login Account' })
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'Password' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
