import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsStrongPassword } from 'class-validator';

export class RegisterUserDto {
	/** Tài khoản đăng nhập */
	@ApiProperty({ description: 'Email of the user' })
	@IsString()
	@IsNotEmpty()
	// @Exists([UserEntity, (validationArguments) => ({ email: validationArguments.value })])
	email!: string;

	/** Mật khẩu */
	@ApiProperty({ description: 'Password of the user' })
	@IsStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minUppercase: 1 })
	@IsNotEmpty()
	password!: string;

	@ApiProperty({ description: 'User Code Invite' })
	@IsOptional()
	@IsString()
	inviteCode?: string;
}
