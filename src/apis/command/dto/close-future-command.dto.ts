import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CloseFutureCommandDto {
	@ApiProperty({ description: 'Closing price' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	closingPrice!: number;
}
