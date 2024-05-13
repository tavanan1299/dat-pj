import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateStackingDto {
	@ApiProperty({ description: 'Coin name' })
	@IsString()
	coinName!: string;

	@ApiProperty({ description: 'Month' })
	@IsNumber()
	monthSaving?: number;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	quantity?: number;
}
