import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateFutureCommandDto {
	@ApiProperty({ description: 'Expect price' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	expectPrice?: number;

	@ApiProperty({ description: 'Lost stop price' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	lossStopPrice?: number;
}
