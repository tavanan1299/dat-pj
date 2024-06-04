import { IMarket } from '@app/apis/market/market.interface';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetMyMarketHistoriesCommand } from '../commands/get-my-market-histories.command';

@CommandHandler(GetMyMarketHistoriesCommand)
export class GetMyMarketHistoriesHandler implements ICommandHandler<GetMyMarketHistoriesCommand> {
	private logger = new Logger(GetMyMarketHistoriesHandler.name);

	constructor(private readonly marketLogService: IMarket) {}

	async execute(command: GetMyMarketHistoriesCommand) {
		this.logger.log(command);
		const { query, user } = command;
		const queryParams: any = { ...query };

		queryParams.where = { userId: user.id };

		return this.marketLogService.getAllPaginated(queryParams);
	}
}
