import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetAllPendingWalletPaginatedCommand } from '../commands/get-all-pending-wallet-command';
import { IPendingWallet } from '../pending-wallet.interface';

@CommandHandler(GetAllPendingWalletPaginatedCommand)
export class GetAllPendingWalletPaginatedHandler
	implements ICommandHandler<GetAllPendingWalletPaginatedCommand>
{
	private logger = new Logger(GetAllPendingWalletPaginatedHandler.name);

	constructor(private readonly pendingWalletService: IPendingWallet) {}

	async execute(command: GetAllPendingWalletPaginatedCommand) {
		this.logger.log(command);
		const { query } = command;
		return this.pendingWalletService.getAllPaginated({ ...query, relations: ['user'] });
	}
}
