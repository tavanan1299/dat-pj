import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFutureCommandDto {
	@ApiProperty({ description: 'Expect price' })
	@IsNumber()
	@IsNotEmpty()
	expectPrice?: number;

	@ApiProperty({ description: 'Lost stop price' })
	@IsNumber()
	@IsNotEmpty()
	lossStopPrice?: number;
}
