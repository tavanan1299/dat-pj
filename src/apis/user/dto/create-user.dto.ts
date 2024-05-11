import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({ description: 'Tên đăng nhập' })
	@IsString()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ description: 'Mật khẩu đăng nhập' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
