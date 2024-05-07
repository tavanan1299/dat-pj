import { OTPType } from '@app/common/enums/otpType.enum';
import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

export class VerifyDto {
	@ApiProperty({ description: 'Verify email' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'OTP code' })
	@IsNumber()
	@IsNotEmpty()
	otp!: number;

	@ApiProperty({ description: 'Type Verify' })
	@IsEnum(OTPType)
	@IsNotEmpty()
	type?: OTPType;
}
