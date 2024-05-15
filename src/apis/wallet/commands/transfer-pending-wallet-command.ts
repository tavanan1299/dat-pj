import { UserEntity } from '@app/apis/user/entities/user.entity';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

export class TransferPendingWalletCommand {
	user!: UserEntity;
	data!: UpdateWalletDto;

	constructor(data: TransferPendingWalletCommand) {
		Object.assign(this, data);
	}
}
