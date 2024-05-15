import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetAllWalletPaginatedCommand } from '../commands/get-all-wallet-command';
import { IWallet } from '../wallet.interface';

@CommandHandler(GetAllWalletPaginatedCommand)
export class GetAllUserPaginatedHandler implements ICommandHandler<GetAllWalletPaginatedCommand> {
	private logger = new Logger(GetAllUserPaginatedHandler.name);

	constructor(private readonly walletService: IWallet) {}

	async execute(command: GetAllWalletPaginatedCommand) {
		this.logger.log(command);
		const { query } = command;
		console.log(query, '-----');
		return this.walletService.getAllPaginated(query);
	}
}
