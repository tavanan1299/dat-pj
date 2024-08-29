import { FutureCommandLogEntity } from '@app/apis/log/future-command-log/entities/future-command-log.entity';
import { IWallet } from '@app/apis/wallet/wallet.interface';
import { ROLES } from '@app/common/constants/role.constant';
import { CommonStatus } from '@app/common/enums/status.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { CancelFutureCommand } from '../commands/cancel-future-command.command';
import { FutureCommandEntity } from '../entities/future-command.entity';
import { IFutureCommand } from '../future-command.interface';

@CommandHandler(CancelFutureCommand)
export class CancelFutureCommandHandler implements ICommandHandler<CancelFutureCommand> {
	private logger = new Logger(CancelFutureCommandHandler.name);

	constructor(
		private readonly entityManager: EntityManager,
		private readonly futureCommandService: IFutureCommand,
		private readonly walletService: IWallet
	) {}

	async execute(command: CancelFutureCommand) {
		this.logger.debug('execute');

		const { commandId, user, data } = command;

		try {
			return this.entityManager.transaction(async (trx) => {
				const currentCommand = await trx.getRepository(FutureCommandEntity).findOneBy({
					id: commandId
				});

				if (!currentCommand) {
					throw new BadRequestException('Command not found');
				}

				const {
					id,
					createdAt,
					updatedAt,
					deletedAt,
					lessThanEntryPrice,
					isEntry,
					...rest
				} = currentCommand;

				if (currentCommand.userId === user.id || user.role.name === ROLES.ADMIN) {
					if (currentCommand.isEntry) {
						await this.futureCommandService.handleFutureCommand(
							trx,
							currentCommand,
							data.closingPrice
						);

						await trx.getRepository(FutureCommandEntity).remove(currentCommand);
						return 'Cancel future command successfully';
					}

					await trx.getRepository(FutureCommandLogEntity).save({
						...rest,
						status: CommonStatus.SUCCESS,
						desc: 'cancelled',
						PNLClosed: 0,
						closedVolume: currentCommand.entryPrice * currentCommand.leverage,
						closingPrice: data.closingPrice,
						closedAt: new Date()
					});

					await trx.getRepository(FutureCommandEntity).remove(currentCommand);
					return 'Cancel future command successfully';
				}

				throw new BadRequestException('Access denied');
			});
		} catch (error) {
			throw error;
		}
	}
}
