import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateVerifyUserDto {
	@ApiProperty({ description: 'Avatar' })
	@IsDate()
	@Type(() => Date)
	dateOfBirth!: Date;

	@ApiProperty({ description: 'Phone' })
	@IsString()
	faceID?: string;

	@ApiProperty({ description: 'Address' })
	@IsString()
	address?: string;

	@ApiProperty({ description: 'City' })
	@IsString()
	citizenID?: string;
}
