import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
	@ApiProperty({ description: 'Email of the user' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'Password of the user' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
