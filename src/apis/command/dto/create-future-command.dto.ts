import { FutureCommandOrderType, FutureCommandType } from '@app/common/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFutureCommandDto {
	@ApiProperty({ description: 'Coin name' })
	@IsString()
	@IsNotEmpty()
	coinName!: string;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	quantity!: number;

	@ApiProperty({ description: 'Entry price' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	entryPrice!: number;

	@ApiProperty({ description: 'Expect price' })
	@IsNumber()
	@Min(0)
	@IsOptional()
	expectPrice?: number;

	@ApiProperty({ description: 'Lost stop price' })
	@IsNumber()
	@Min(0)
	@IsOptional()
	lossStopPrice?: number;

	@ApiProperty({
		description: 'Type',
		example: `${FutureCommandType.LIMIT}|${FutureCommandType.MARKET}`
	})
	@IsEnum(FutureCommandType)
	@IsNotEmpty()
	type!: FutureCommandType;

	@ApiProperty({
		description: 'Order type',
		example: `${FutureCommandOrderType.LONG}|${FutureCommandOrderType.SHORT}`
	})
	@IsEnum(FutureCommandOrderType)
	@IsNotEmpty()
	orderType!: FutureCommandOrderType;

	@ApiProperty({ description: 'Leverage' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	leverage!: number;
}
