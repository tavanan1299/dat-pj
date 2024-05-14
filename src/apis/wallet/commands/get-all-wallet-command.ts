import { PaginationDto } from '@common';
import { WalletEntity } from '../entities/wallet.entity';

export class GetAllWalletPaginatedCommand {
	query!: PaginationDto<WalletEntity>;

	constructor(data: GetAllWalletPaginatedCommand) {
		Object.assign(this, data);
	}
}
