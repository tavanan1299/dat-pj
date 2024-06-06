import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { ROLES } from '@app/common/constants/role.constant';
import { CommandType } from '@app/common/enums/status.enum';
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
		private readonly entityManager: EntityManager
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

				const wallet = await trx.getRepository(WalletEntity).findOne({
					where: {
						coinName: currentCommand.coinName,
						userId: currentCommand.userId
					}
				});

				if (
					(currentCommand.userId === user.id || user.role.name === ROLES.ADMIN) &&
					wallet
				) {
					if (currentCommand.type === CommandType.SELL) {
						await trx.getRepository(WalletEntity).update(wallet.id, {
							quantity: currentCommand.quantity
						});
					}

					await trx.getRepository(CommandEntity).remove(currentCommand);

					return 'Cancel Command successfully';
				}

				throw new BadRequestException('Access denied');
			});
		} catch (error) {
			throw error;
		}
	}
}
