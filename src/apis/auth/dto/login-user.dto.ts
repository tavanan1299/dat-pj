import { IsEmail, IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
	@ApiProperty({ description: 'Email of the user' })
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'Password of the user' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
