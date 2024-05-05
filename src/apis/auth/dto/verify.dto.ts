import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VerifyDto {
	@ApiProperty({ description: 'User Id cần xác nhận' })
	@IsString()
	@IsNotEmpty()
	userId!: string;

	@ApiProperty({ description: 'Mã OTP' })
	@IsNumber()
	@IsNotEmpty()
	otp!: number;
}
