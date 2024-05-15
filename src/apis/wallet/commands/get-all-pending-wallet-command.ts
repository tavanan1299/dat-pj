import { PaginationDto } from '@common';
import { PendingWalletEntity } from '../entities/pending-wallet.entity';

export class GetAllPendingWalletPaginatedCommand {
	query!: PaginationDto<PendingWalletEntity>;

	constructor(data: GetAllPendingWalletPaginatedCommand) {
		Object.assign(this, data);
	}
}
