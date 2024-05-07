import { UserEntity } from '@app/apis/user/entities/user.entity';
import { Exists } from '@app/validators/exists.validator';
import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class RegisterUserDto {
	/** Tài khoản đăng nhập */
	@ApiProperty({ description: 'Register email' })
	@IsString()
	@IsNotEmpty()
	@Exists([UserEntity, (validationArguments) => ({ email: validationArguments.value })])
	email!: string;

	/** Mật khẩu */
	@ApiProperty({ description: 'Password of user' })
	@IsStrongPassword(
		{ minLength: 6, minNumbers: 1, minLowercase: 1, minUppercase: 1, minSymbols: 0 },
		{
			message:
				'The password should contain at least 1 uppercase character, 1 lowercase, 1 number and should be at least 6 characters long.'
		}
	)
	@IsNotEmpty()
	password!: string;
}
