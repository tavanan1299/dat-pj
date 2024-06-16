import { FutureCommandType } from '@app/common/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFutureCommandDto {
	@ApiProperty({ description: 'Coin name' })
	@IsString()
	@IsNotEmpty()
	coinName!: string;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@IsNotEmpty()
	quantity!: number;

	@ApiProperty({ description: 'Entry price' })
	@IsNumber()
	@IsNotEmpty()
	entryPrice!: number;

	@ApiProperty({ description: 'Expect price' })
	@IsNumber()
	@IsOptional()
	expectPrice?: number;

	@ApiProperty({ description: 'Lost stop price' })
	@IsNumber()
	@IsOptional()
	lossStopPrice?: number;

	@ApiProperty({
		description: 'Type',
		example: `${FutureCommandType.LIMIT}|${FutureCommandType.MARKET}`
	})
	@IsEnum(FutureCommandType)
	@IsNotEmpty()
	type!: FutureCommandType;

	@ApiProperty({ description: 'Leverage' })
	@IsNumber()
	@IsNotEmpty()
	leverage!: number;
}
