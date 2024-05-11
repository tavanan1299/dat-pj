import { IsEmail, IsNotEmpty } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
	@ApiProperty({ description: 'Email of the user' })
	@IsEmail()
	@IsNotEmpty()
	email!: string;
}
