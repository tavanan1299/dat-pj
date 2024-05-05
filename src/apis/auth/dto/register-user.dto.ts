import { UserEntity } from '@app/apis/user/entities/user.entity';
import { Exists } from '@app/validators/exists.validator';
import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
	/** Tài khoản đăng nhập */
	@ApiProperty({ description: 'Tài khoản đăng nhập' })
	@IsString()
	@IsNotEmpty()
	@Exists([UserEntity, (validationArguments) => ({ email: validationArguments.value })])
	email!: string;

	/** Mật khẩu */
	@ApiProperty({ description: 'Mật khẩu' })
	@IsString()
	@IsNotEmpty()
	password!: string;
}
