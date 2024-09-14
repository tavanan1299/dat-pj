import { IWallet } from '@app/apis/wallet/wallet.interface';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Not } from 'typeorm';
import { GetMyTransHistoriesCommand } from '../commands/get-my-trans-histories.command';
import { GetMyWalletCommand } from '../commands/get-my-wallet.command';

@CommandHandler(GetMyWalletCommand)
export class GetMyWalletHandler implements ICommandHandler<GetMyWalletCommand> {
	private logger = new Logger(GetMyWalletHandler.name);

	constructor(private readonly walletService: IWallet) {}

	async execute(command: GetMyTransHistoriesCommand) {
		this.logger.log(command);
		const { query, user } = command;
		const queryParams: any = { ...query };
		queryParams.where = { userId: user.id, quantity: Not(0) };
		return this.walletService.getAllPaginated(queryParams);
	}
}
