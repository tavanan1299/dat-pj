import { WalletLogEntity } from '@app/apis/log/wallet-log/entities/wallet-log.entity';
import { PaginationDto } from '@common';
import { UserEntity } from '../entities/user.entity';

export class GetMyTransHistoriesCommand {
	query!: PaginationDto<WalletLogEntity>;
	user!: UserEntity;

	constructor(data: GetMyTransHistoriesCommand) {
		Object.assign(this, data);
	}
}
