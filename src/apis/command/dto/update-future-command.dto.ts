import { FutureCommandOrderType } from '@app/common/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateFutureCommandDto {
	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@IsOptional()
	quantity?: number;

	@ApiProperty({ description: 'Entry price' })
	@IsNumber()
	@IsOptional()
	entryPrice?: number;

	@ApiProperty({ description: 'Expect price' })
	@IsNumber()
	@IsOptional()
	expectPrice?: number;

	@ApiProperty({ description: 'Lost stop price' })
	@IsNumber()
	@IsOptional()
	lossStopPrice?: number;

	@ApiProperty({
		description: 'Order type',
		example: `${FutureCommandOrderType.LONG}|${FutureCommandOrderType.SHORT}`
	})
	@IsEnum(FutureCommandOrderType)
	@IsOptional()
	orderType?: FutureCommandOrderType;

	@ApiProperty({ description: 'Leverage' })
	@IsNumber()
	@IsOptional()
	leverage?: number;
}
