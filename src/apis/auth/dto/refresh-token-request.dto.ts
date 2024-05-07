import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
	@ApiProperty({ description: 'Refresh token' })
	@IsString()
	@IsNotEmpty()
	readonly refreshToken!: string;
}
