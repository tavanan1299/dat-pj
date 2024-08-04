import { BaseEntity } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { IsNumber } from '../decorators/validation.decorator';

export class PaginationDto<T = BaseEntity> {
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => +(value || 10))
	@ApiProperty({ description: 'Item per page', example: '10', type: 'string' })
	limit?: number;

	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => +(value || 10))
	@ApiProperty({ description: 'Current page', example: '1', type: 'string' })
	page?: number;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
	@ApiProperty({
		description: 'Sort by field',
		example: '{ "createdAt": "ASC" }',
		type: 'string'
	})
	order?: FindOptionsOrder<T>;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
	@ApiProperty({
		description: 'Filter by field',
		example: '{ "name": "string" }',
		type: 'string'
	})
	filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[];

	// @IsOptional()
	// @ApiProperty({ description: 'Search...', example: '' })
	// search?: string;
}
