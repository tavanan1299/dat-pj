import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({ description: 'Email' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'Password' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
