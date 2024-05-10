import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VerifyDto {
	@ApiProperty({ description: 'Email of the user' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'OTP Code' })
	@IsNumber()
	@IsNotEmpty()
	otp!: number;
}
