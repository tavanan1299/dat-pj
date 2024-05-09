import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class ForgottenPasswordDto {
	@ApiProperty({ description: 'Id cần xác nhận' })
	@IsString()
	@IsNotEmpty()
	id!: string;

	@ApiProperty({ description: 'Email xác nhận' })
	@IsString()
	@IsNotEmpty()
	email!: string;
}
