import { PaginationDto } from '@common';
import { PendingWalletEntity } from '../entities/pending-wallet.entity';

export class GetAllWalletPaginatedCommand {
	query!: PaginationDto<PendingWalletEntity>;

	constructor(data: GetAllWalletPaginatedCommand) {
		Object.assign(this, data);
	}
}
