import { ICommand } from '@app/apis/command/command.interface';
import { CommandEntity } from '@app/apis/command/entities/command.entity';
import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { CommandType } from '@app/common/enums/status.enum';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { CancelMyCommands } from '../commands/cancel-my-commands.command';

@CommandHandler(CancelMyCommands)
export class CancelMyCommandsHandler implements ICommandHandler<CancelMyCommands> {
	private logger = new Logger(CancelMyCommandsHandler.name);

	constructor(
		private readonly commandService: ICommand,
		private readonly entityManager: EntityManager
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
					if (command?.type === CommandType.SELL) {
						const wallet = await trx.getRepository(WalletEntity).findOne({
							where: {
								coinName: command.coinName,
								userId: userId
							}
						});

						if (wallet) {
							await trx.getRepository(WalletEntity).update(wallet.id, {
								quantity: +wallet.quantity + +command.quantity
							});
						}
					}
				}

				await trx.getRepository(CommandEntity).delete({});

				return 'Cancel my command successfully';
			});
		} catch (error) {
			throw error;
		}
	}
}
