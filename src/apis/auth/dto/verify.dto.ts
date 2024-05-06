import { OTPType } from '@app/common/enums/otpType.enum';
import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

export class VerifyDto {
	@ApiProperty({ description: 'User Id cần xác nhận' })
	@IsString()
	@IsNotEmpty()
	userId!: string;

	@ApiProperty({ description: 'Mã OTP' })
	@IsNumber()
	@IsNotEmpty()
	otp!: number;

	@ApiProperty({ description: 'Type Verify' })
	@IsEnum(OTPType)
	@IsNotEmpty()
	type?: OTPType;
}
