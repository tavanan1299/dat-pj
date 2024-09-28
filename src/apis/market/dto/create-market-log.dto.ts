import { CommandType } from '@app/common/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateMarketLogDto {
	@ApiProperty({ description: 'Coin name' })
	@IsString()
	@IsNotEmpty()
	coinName!: string;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	quantity!: number;

	@ApiProperty({ description: 'Current price' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	currentPrice!: number;

	@ApiProperty({ description: 'Total pay' })
	@IsNumber()
	@Min(0)
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
