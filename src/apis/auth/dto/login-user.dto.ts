import { IsEmail, IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
	/** Tài khoản đăng nhập */
	@ApiProperty({ description: 'Tài khoản đăng nhập' })
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	/** Mật khẩu */
	@ApiProperty({ description: 'Mật khẩu' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
