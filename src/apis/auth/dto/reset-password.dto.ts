import { IsNotEmpty, IsString } from '@common';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { VerifyDto } from './verify.dto';

export class ResetPasswordDto extends PartialType(VerifyDto) {
	@ApiProperty({ description: 'Password of the user' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
