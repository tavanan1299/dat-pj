import { IWallet } from '@app/apis/wallet/wallet.interface';
import { DEFAULT_CURRENCY } from '@app/common/constants/constant';
import { ROLES } from '@app/common/constants/role.constant';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager } from 'typeorm';
import { UpdateFutureCommand } from '../commands/update-future-command.command';
import { FutureCommandEntity } from '../entities/future-command.entity';

@CommandHandler(UpdateFutureCommand)
export class UpdateFutureCommandHandler implements ICommandHandler<UpdateFutureCommand> {
	private logger = new Logger(UpdateFutureCommandHandler.name);

	constructor(
		private eventEmitter: EventEmitter2,
		private readonly walletService: IWallet,
		private readonly entityManager: EntityManager
	) {}

	async execute(command: UpdateFutureCommand) {
		this.logger.debug('execute');

		const { commandId, data, user } = command;

		const futureCommand = await this.entityManager
			.getRepository(FutureCommandEntity)
			.findOneOrFail({ where: { id: commandId } });

		if (futureCommand.isEntry) {
			throw new BadRequestException('This command already entry');
		}
		console.log(futureCommand.userId, user.id);
		if (futureCommand.userId === user.id || user.role.name === ROLES.ADMIN) {
			await this.entityManager.transaction(async (trx) => {
				const rollbackQuantity = futureCommand.quantity / futureCommand.leverage;
				if (data.quantity || data.leverage) {
					const quantity = data.quantity || futureCommand.quantity;
					const leverage = data.leverage || futureCommand.leverage;
					const updatedPrice = quantity / leverage;
					if (updatedPrice > rollbackQuantity) {
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							updatedPrice - rollbackQuantity,
							user.id
						);
					} else {
						await this.walletService.increase(
							trx,
							DEFAULT_CURRENCY,
							rollbackQuantity - updatedPrice,
							user.id
						);
					}
				}

				await trx.getRepository(FutureCommandEntity).update(commandId, { ...data });

				this.eventEmitter.emit('command.created', futureCommand.coinName);
			});

			return 'Update future command success';
		}
		throw new BadRequestException('Access denied');
	}
}
