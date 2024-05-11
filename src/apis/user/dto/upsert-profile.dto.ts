import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpsertProfileDto {
	@ApiProperty({ description: 'Avatar' })
	@IsOptional()
	@IsString()
	@IsUrl(undefined, { message: 'Image is not valid.' })
	avatar?: string;

	@ApiProperty({ description: 'Full name' })
	@IsOptional()
	@IsString()
	fullname?: string;

	@ApiProperty({ description: 'Phone' })
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiProperty({ description: 'Date Of Birth' })
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	birthDay?: Date;

	@ApiProperty({ description: 'Address' })
	@IsString()
	@IsOptional()
	address?: string;

	@ApiProperty({ description: 'Country' })
	@IsOptional()
	@IsString()
	country?: string;
}
