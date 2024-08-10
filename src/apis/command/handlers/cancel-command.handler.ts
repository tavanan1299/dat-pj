import { CommandLogEntity } from '@app/apis/log/command-log/entities/command-log.entity';
import { IWallet } from '@app/apis/wallet/wallet.interface';
import { DEFAULT_CURRENCY, HistoryWalletType } from '@app/common/constants/constant';
import { ROLES } from '@app/common/constants/role.constant';
import { CommandType, CommonStatus } from '@app/common/enums/status.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { ICommand } from '../command.interface';
import { CancelCommand } from '../commands/cancel-command.command';
import { CommandEntity } from '../entities/command.entity';

@CommandHandler(CancelCommand)
export class CancelCommandHandler implements ICommandHandler<CancelCommand> {
	private logger = new Logger(CancelCommandHandler.name);

	constructor(
		private readonly commandService: ICommand,
		private readonly entityManager: EntityManager,
		private readonly walletService: IWallet
	) {}

	async execute(command: CancelCommand) {
		this.logger.debug('execute');

		const { commandId, user } = command;

		try {
			return this.entityManager.transaction(async (trx) => {
				const currentCommand = await trx.getRepository(CommandEntity).findOneBy({
					id: commandId
				});

				if (!currentCommand) {
					throw new BadRequestException('Command not found');
				}

				if (currentCommand.userId === user.id || user.role.name === ROLES.ADMIN) {
					if (currentCommand.type === CommandType.SELL) {
						await this.walletService.increase(
							trx,
							currentCommand.coinName,
							currentCommand.quantity,
							user.id,
							HistoryWalletType.SPOT_LIMIT
						);
					} else {
						await this.walletService.increase(
							trx,
							DEFAULT_CURRENCY,
							currentCommand.totalPay,
							user.id,
							HistoryWalletType.SPOT_LIMIT
						);
					}

					await trx.getRepository(CommandEntity).remove(currentCommand);

					const { id, createdAt, updatedAt, deletedAt, ...rest } = currentCommand;

					// add logs
					await trx.getRepository(CommandLogEntity).save({
						...rest,
						status: CommonStatus.SUCCESS,
						desc: 'Cancel'
					});

					return 'Cancel Command successfully';
				}

				throw new BadRequestException('Access denied');
			});
		} catch (error) {
			throw error;
		}
	}
}
