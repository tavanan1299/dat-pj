import { CommandType } from '@app/common/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateCommandDto {
	@ApiProperty({ description: 'Coin name' })
	@IsString()
	@IsNotEmpty()
	coinName!: string;

	@ApiProperty({ description: 'Total Pay' })
	@IsNumber()
	@IsNotEmpty()
	totalPay!: number;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@IsNotEmpty()
	quantity!: number;

	@ApiProperty({ description: 'Expect price' })
	@IsNumber()
	@IsNotEmpty()
	expectPrice!: number;

	@ApiProperty({ description: 'Type', example: `${CommandType.BUY}|${CommandType.SELL}` })
	@IsEnum(CommandType)
	@IsNotEmpty()
	type!: CommandType;

	@ApiProperty({ description: 'Loss Stop Price' })
	@ValidateIf((t) => t.type === CommandType.SELL)
	@IsNumber()
	@IsNotEmpty()
	lossStopPrice!: number;
}
