import { IWalletLog } from '@app/apis/log/wallet-log/wallet-log.interface';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetMyTransHistoriesCommand } from '../commands/get-my-trans-histories.command';

@CommandHandler(GetMyTransHistoriesCommand)
export class GetMyTransHistoriesHandler implements ICommandHandler<GetMyTransHistoriesCommand> {
	private logger = new Logger(GetMyTransHistoriesHandler.name);

	constructor(private readonly walletLogService: IWalletLog) {}

	async execute(command: GetMyTransHistoriesCommand) {
		this.logger.log(command);
		const { query, user } = command;
		const queryParams: any = { ...query };

		queryParams.where = { userId: user.id };
		return this.walletLogService.getAllPaginated(queryParams);
	}
}
