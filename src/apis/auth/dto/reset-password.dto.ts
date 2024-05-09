import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
	@ApiProperty({ description: 'Email xác nhận' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'Mật khẩu mới' })
	@IsString()
	@IsNotEmpty()
	newPassword!: string;

	@ApiProperty({ description: 'Mật khẩu hiện tại' })
	@IsString()
	@IsNotEmpty()
	currentPassword!: string;
}
