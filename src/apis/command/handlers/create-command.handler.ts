import { IWallet } from '@app/apis/wallet/wallet.interface';
import { DEFAULT_CURRENCY } from '@app/common/constants/constant';
import { CommandType } from '@app/common/enums/status.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager } from 'typeorm';
import { ICommand } from '../command.interface';
import { CreateCommand } from '../commands/create-command.command';
import { CommandEntity } from '../entities/command.entity';

@CommandHandler(CreateCommand)
export class CreateCommandHandler implements ICommandHandler<CreateCommand> {
	private logger = new Logger(CreateCommandHandler.name);

	constructor(
		private readonly commandService: ICommand,
		private eventEmitter: EventEmitter2,
		private readonly walletService: IWallet,
		private readonly entityManager: EntityManager
	) {}

	async execute(command: CreateCommand) {
		this.logger.debug('execute');

		const { data, user } = command;
		await this.entityManager.transaction(async (trx) => {
			if (data.type === CommandType.BUY) {
				await trx.getRepository(CommandEntity).save({
					...data,
					userId: user.id,
					lossStopPrice: undefined
				});

				await this.walletService.decrease(trx, DEFAULT_CURRENCY, data.totalPay, user.id);
			} else {
				if (!data.lossStopPrice) {
					throw new BadRequestException('Field lossStopPrice is required');
				}

				await trx.getRepository(CommandEntity).save({ ...data, userId: user.id });

				await this.walletService.decrease(trx, data.coinName, data.quantity, user.id);
			}

			this.eventEmitter.emit('command.created', data.coinName);
		});

		return 'Create Command successfully';
	}
}
