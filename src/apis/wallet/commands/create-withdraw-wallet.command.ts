import { UserEntity } from '@app/apis/user/entities/user.entity';
import { CreateWithdrawWalletDto } from '../dto/create-withdraw-wallet.dto';

export class CreateWithdrawWalletCommand {
	user!: UserEntity;
	data!: CreateWithdrawWalletDto;

	constructor(data: CreateWithdrawWalletCommand) {
		Object.assign(this, data);
	}
}
