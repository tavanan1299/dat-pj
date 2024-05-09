import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AccessForgottenPasswordDto {
	@ApiProperty({ description: 'OTP' })
	@IsNumber()
	@IsNotEmpty()
	otp!: number;

	@ApiProperty({ description: 'Password reset with OTP' })
	@IsString()
	@IsNotEmpty()
	newPassword!: string;

	@ApiProperty({ description: 'Email xác nhận' })
	@IsString()
	@IsNotEmpty()
	email!: string;
}
