import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VerifyDto {
	@ApiProperty({ description: 'Verify email' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'OTP code' })
	@IsNumber()
	@IsNotEmpty()
	otp!: number;
}
