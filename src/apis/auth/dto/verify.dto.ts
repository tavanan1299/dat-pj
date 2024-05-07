import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VerifyDto {
	@ApiProperty({ description: 'Email cần xác nhận' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'Mã OTP' })
	@IsNumber()
	@IsNotEmpty()
	otp!: number;
}
