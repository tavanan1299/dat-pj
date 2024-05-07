import { UserEntity } from '@app/apis/user/entities/user.entity';
import { Exists } from '@app/validators/exists.validator';
import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class RegisterUserDto {
	/** Tài khoản đăng nhập */
	@ApiProperty({ description: 'Tài khoản đăng nhập' })
	@IsString()
	@IsNotEmpty()
	@Exists([UserEntity, (validationArguments) => ({ email: validationArguments.value })])
	email!: string;

	/** Mật khẩu */
	@ApiProperty({ description: 'Mật khẩu' })
	@IsStrongPassword({ minLength: 6, minNumbers: 1, minLowercase: 1, minUppercase: 1 })
	@IsNotEmpty()
	password!: string;
}
