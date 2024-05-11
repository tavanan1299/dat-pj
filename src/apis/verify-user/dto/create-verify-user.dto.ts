import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsUrl } from 'class-validator';

export class CreateVerifyUserDto {
	@ApiProperty({ description: 'Avatar' })
	@IsDate()
	@Type(() => Date)
	dateOfBirth!: Date;

	@ApiProperty({ description: 'Phone' })
	@IsString()
	@IsUrl(undefined, { message: 'Image is not valid.' })
	faceID?: string;

	@ApiProperty({ description: 'Address' })
	@IsString()
	address?: string;

	@ApiProperty({ description: 'City' })
	@IsString()
	@IsUrl(undefined, { message: 'Image is not valid.' })
	citizenID?: string;
}
