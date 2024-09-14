import { WalletType } from '@app/common/enums/wallet.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateIf } from 'class-validator';

export class UpdateWalletDto {
	@ApiProperty({ description: 'Coin Name' })
	@IsString()
	@IsNotEmpty()
	coinName!: string;

	@ApiProperty({ description: 'Quantity' })
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	quantity!: number;

	@ApiProperty({
		description: 'Type of transfer',
		example: `${WalletType.DEPOSIT}|${WalletType.WITHDRAW}`
	})
	@IsString()
	@IsNotEmpty()
	@IsEnum(WalletType)
	type!: WalletType;

	@ApiProperty({ description: 'Picture of proof' })
	@IsString()
	@IsNotEmpty()
	proofURL!: string;

	@ApiProperty({ description: 'Wallet address' })
	@ValidateIf((t) => t.type === WalletType.WITHDRAW)
	@IsString()
	@IsNotEmpty()
	wallet_address!: string;

	@ApiProperty({ description: 'Network' })
	@ValidateIf((t) => t.type === WalletType.WITHDRAW)
	@IsString()
	@IsNotEmpty()
	network!: string;
}
