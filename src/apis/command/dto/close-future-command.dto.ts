import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CloseFutureCommandDto {
	@ApiProperty({ description: 'PNL closed' })
	@IsNumber()
	@IsNotEmpty()
	PNLClosed!: number;

	@ApiProperty({ description: 'Closing price' })
	@IsNumber()
	@IsNotEmpty()
	closingPrice!: number;
}
