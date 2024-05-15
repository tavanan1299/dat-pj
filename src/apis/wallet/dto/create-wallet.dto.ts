import { IsNotEmpty, IsString } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateWalletDto {
	@ApiProperty({ description: 'Coin Name' })
	@IsString()
	@IsNotEmpty()
	coinName!: string;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@IsNotEmpty()
	quantity!: number;
}

export class CreateWalletDtoWithUserId extends CreateWalletDto {
	userId!: string;
}
