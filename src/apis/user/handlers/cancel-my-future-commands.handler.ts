import { ICommand } from '@app/apis/command/command.interface';
import { FutureCommandEntity } from '@app/apis/command/entities/future-command.entity';
import { IFutureCommand } from '@app/apis/command/future-command.interface';
import { FutureCommandLogEntity } from '@app/apis/log/future-command-log/entities/future-command-log.entity';
import { BINANCE_API } from '@app/common/constants/constant';
import { CommonStatus } from '@app/common/enums/status.enum';
import { coinName2USDT } from '@app/common/helpers/common.helper';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import axios from 'axios';
import { EntityManager } from 'typeorm';
import { CancelMyFutureCommands } from '../commands/cancel-my-future-commands.command';

@CommandHandler(CancelMyFutureCommands)
export class CancelMyFutureCommandsHandler implements ICommandHandler<CancelMyFutureCommands> {
	private logger = new Logger(CancelMyFutureCommandsHandler.name);

	constructor(
		private readonly commandService: ICommand,
		private readonly entityManager: EntityManager,
		private readonly futureCommandService: IFutureCommand
	) {}

	async execute(command: CancelMyFutureCommands) {
		this.logger.debug('execute');

		const { userId } = command;

		try {
			return this.entityManager.transaction(async (trx) => {
				const commands = await trx.getRepository(FutureCommandEntity).find({
					where: { userId }
				});

				for (const command of commands) {
					const binanceCoin = await axios.get(
						`${BINANCE_API}${coinName2USDT(command.coinName)}`
					);

					if (command.isEntry) {
						await this.futureCommandService.handleFutureCommand(
							trx,
							command,
							binanceCoin.data.price
						);
					} else {
						const {
							id,
							createdAt,
							updatedAt,
							deletedAt,
							lessThanEntryPrice,
							isEntry,
							...rest
						} = command;

						await trx.getRepository(FutureCommandLogEntity).save({
							...rest,
							status: CommonStatus.SUCCESS,
							desc: 'cancelled',
							PNLClosed: 0,
							closedVolume: command.entryPrice * command.leverage,
							closingPrice: binanceCoin.data.price,
							closedAt: new Date()
						});
					}

					await trx.getRepository(FutureCommandEntity).delete(command.id);
				}

				return 'Cancel my future command successfully';
			});
		} catch (error) {
			throw error;
		}
	}
}
