import { CommandType } from '@app/common/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateIf } from 'class-validator';

export class CreateCommandDto {
	@ApiProperty({ description: 'Coin name' })
	@IsString()
	@IsNotEmpty()
	coinName!: string;

	@ApiProperty({ description: 'Total Pay' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	totalPay!: number;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	quantity!: number;

	@ApiProperty({ description: 'Expect price' })
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	expectPrice!: number;

	@ApiProperty({ description: 'Type', example: `${CommandType.BUY}|${CommandType.SELL}` })
	@IsEnum(CommandType)
	@IsNotEmpty()
	type!: CommandType;

	@ApiProperty({ description: 'Loss Stop Price' })
	@ValidateIf((t) => t.type === CommandType.SELL)
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	lossStopPrice!: number;
}
