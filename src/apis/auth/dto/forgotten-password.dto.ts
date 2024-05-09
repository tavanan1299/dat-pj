import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class ForgottenPasswordDto {
	@ApiProperty({ description: 'Email confirm' })
	@IsString()
	@IsNotEmpty()
	email!: string;
}
