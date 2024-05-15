import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';

export class WithdrawWalletDto extends PartialType(CreateWalletDto) {}
