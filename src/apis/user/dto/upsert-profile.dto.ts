import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class UpsertProfileDto {
	@ApiProperty({ description: 'Avatar' })
	@IsString()
	avatar?: string;

	@ApiProperty({ description: 'Full name' })
	@IsString()
	fullname?: string;

	@ApiProperty({ description: 'Phone' })
	@IsString()
	phone?: string;

	@ApiProperty({ description: 'Date Of Birth' })
	@IsDate()
	@Type(() => Date)
	birthDay?: Date;

	@ApiProperty({ description: 'Address' })
	@IsString()
	address?: string;

	@ApiProperty({ description: 'Country' })
	@IsString()
	country?: string;
}
