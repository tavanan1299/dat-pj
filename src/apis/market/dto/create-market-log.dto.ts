import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMarketLogDto {
	@ApiProperty({ description: 'Coin name' })
	@IsString()
	@IsNotEmpty()
	coinName!: string;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@IsNotEmpty()
	quantity!: number;

	@ApiProperty({ description: 'Current price' })
	@IsNumber()
	@IsNotEmpty()
	currentPrice!: number;

	@ApiProperty({ description: 'Total pay' })
	@IsNumber()
	@IsNotEmpty()
	totalPay!: number;
}
