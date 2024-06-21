import { ICommand } from '@app/apis/command/command.interface';
import { CommandEntity } from '@app/apis/command/entities/command.entity';
import { CommandLogEntity } from '@app/apis/log/command-log/entities/command-log.entity';
import { IWallet } from '@app/apis/wallet/wallet.interface';
import { DEFAULT_CURRENCY } from '@app/common/constants/constant';
import { CommandType, CommonStatus } from '@app/common/enums/status.enum';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { CancelMyCommands } from '../commands/cancel-my-commands.command';

@CommandHandler(CancelMyCommands)
export class CancelMyCommandsHandler implements ICommandHandler<CancelMyCommands> {
	private logger = new Logger(CancelMyCommandsHandler.name);

	constructor(
		private readonly commandService: ICommand,
		private readonly entityManager: EntityManager,
		private readonly walletService: IWallet
	) {}

	async execute(command: CancelMyCommands) {
		this.logger.debug('execute');

		const { userId } = command;

		try {
			return this.entityManager.transaction(async (trx) => {
				const commands = await trx.getRepository(CommandEntity).find({
					where: { userId }
				});

				for (const command of commands) {
					if (command.type === CommandType.SELL) {
						await this.walletService.increase(
							trx,
							command.coinName,
							command.quantity,
							userId
						);
					} else {
						await this.walletService.increase(
							trx,
							DEFAULT_CURRENCY,
							command.totalPay,
							userId
						);
					}
					await trx.getRepository(CommandEntity).delete(command.id);

					const { id, createdAt, updatedAt, deletedAt, ...rest } = command;

					// add logs
					await trx.getRepository(CommandLogEntity).save({
						...rest,
						status: CommonStatus.SUCCESS,
						desc: 'Cancel'
					});
				}

				return 'Cancel my command successfully';
			});
		} catch (error) {
			throw error;
		}
	}
}
