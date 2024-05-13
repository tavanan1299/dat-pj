import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsUrl } from 'class-validator';

export class CreateVerifyUserDto {
	@ApiProperty({ description: 'Avatar' })
	@IsDate()
	@Type(() => Date)
	dateOfBirth!: Date;

	@ApiProperty({ description: 'Image face of user' })
	@IsString()
	@IsUrl(undefined, { message: 'Image is not valid.' })
	faceID?: string;

	@ApiProperty({ description: 'Address' })
	@IsString()
	address?: string;

	@ApiProperty({ description: 'Image of front Citizen ID' })
	@IsString()
	@IsUrl(undefined, { message: 'Image is not valid.' })
	frontCitizenID?: string;

	@ApiProperty({ description: 'Image of back Citizen ID' })
	@IsString()
	@IsUrl(undefined, { message: 'Image is not valid.' })
	backCitizenID?: string;
}
