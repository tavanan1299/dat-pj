import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CloseFutureCommandDto {
	@ApiProperty({ description: 'Closing price' })
	@IsNumber()
	@IsNotEmpty()
	closingPrice!: number;
}
