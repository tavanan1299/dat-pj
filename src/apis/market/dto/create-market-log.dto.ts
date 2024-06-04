import { CommandType } from '@app/common/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

	@ApiProperty({
		description: 'Type of transfer',
		example: `${CommandType.BUY}|${CommandType.SELL}`
	})
	@IsString()
	@IsNotEmpty()
	@IsEnum(CommandType)
	type!: CommandType;
}
