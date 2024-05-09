import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
	@ApiProperty({ description: 'Email confirm' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'New Password' })
	@IsString()
	@IsNotEmpty()
	newPassword!: string;

	@ApiProperty({ description: 'Current Password' })
	@IsString()
	@IsNotEmpty()
	currentPassword!: string;
}
