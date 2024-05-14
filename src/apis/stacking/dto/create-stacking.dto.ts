import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStackingDto {
	@ApiProperty({ description: 'Coin name' })
	@IsString()
	@IsNotEmpty()
	coinName!: string;

	@ApiProperty({ description: 'Month' })
	@IsNumber()
	@IsNotEmpty()
	monthSaving!: number;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@IsNotEmpty()
	quantity!: number;
}

export class CreateStackingDtoWithUserId extends CreateStackingDto {
	userId!: string;
}
