import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyWalletCommand {
	query!: PaginationDto<WalletEntity>;
	user!: UserEntity;

	constructor(data: GetMyWalletCommand) {
		Object.assign(this, data);
	}
}
