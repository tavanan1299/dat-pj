import { UserEntity } from '@app/apis/user/entities/user.entity';
import { CreateWalletDto } from '../dto/create-wallet.dto';

export class CreateWalletCommand {
	user!: UserEntity;
	data!: CreateWalletDto;

	constructor(data: CreateWalletCommand) {
		Object.assign(this, data);
	}
}
