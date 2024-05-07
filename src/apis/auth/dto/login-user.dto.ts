import { IsEmail, IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
	/** Tài khoản đăng nhập */
	@ApiProperty({ description: 'Email login' })
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	/** Mật khẩu */
	@ApiProperty({ description: 'Your password' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
