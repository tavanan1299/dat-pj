import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ForgottenPasswordDto {
	@ApiProperty({ description: 'User Id cần xác nhận' })
	@IsString()
	@IsNotEmpty()
	userId!: string;

	@ApiProperty({ description: 'Email xác nhận' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'Mã OTP' })
	@IsNumber()
	@IsNotEmpty()
	otp!: number;
}
