import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
	@ApiProperty({ description: 'New password' })
	@IsString()
	@IsNotEmpty()
	newPassword!: string;

	@ApiProperty({ description: 'Current password' })
	@IsString()
	@IsNotEmpty()
	currentPassword!: string;
}
