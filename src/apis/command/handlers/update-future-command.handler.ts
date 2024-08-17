import { IWallet } from '@app/apis/wallet/wallet.interface';
import { ROLES } from '@app/common/constants/role.constant';
import { FutureCommandOrderType } from '@app/common/enums/status.enum';
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

		if (!futureCommand.isEntry) {
			throw new BadRequestException('This command is not entry, please cancel it');
		}

		if (futureCommand.userId === user.id || user.role.name === ROLES.ADMIN) {
			if (futureCommand.orderType === FutureCommandOrderType.LONG) {
				if (
					futureCommand.expectPrice &&
					futureCommand.expectPrice < futureCommand.entryPrice
				) {
					throw new BadRequestException('expectPrice must be greater than entryPrice');
				}
				if (
					futureCommand.lossStopPrice &&
					futureCommand.lossStopPrice > futureCommand.entryPrice
				) {
					throw new BadRequestException('lossStopPrice must be smaller than entryPrice');
				}
			}

			if (futureCommand.orderType === FutureCommandOrderType.SHORT) {
				if (
					futureCommand.expectPrice &&
					futureCommand.expectPrice > futureCommand.entryPrice
				) {
					throw new BadRequestException('expectPrice must be smaller than entryPrice');
				}
				if (
					futureCommand.lossStopPrice &&
					futureCommand.lossStopPrice < futureCommand.entryPrice
				) {
					throw new BadRequestException('lossStopPrice must be greater than entryPrice');
				}
			}

			await this.entityManager.getRepository(FutureCommandEntity).update(commandId, {
				expectPrice: data.expectPrice,
				lossStopPrice: data.lossStopPrice
			});

			return 'Update future command success';
		}
		throw new BadRequestException('Access denied');
	}
}
