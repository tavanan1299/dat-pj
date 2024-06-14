import { IWallet } from '@app/apis/wallet/wallet.interface';
import { DEFAULT_CURRENCY } from '@app/common/constants/constant';
import { FutureCommandType } from '@app/common/enums/status.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager } from 'typeorm';
import { CreateFutureCommand } from '../commands/create-future-command.command';
import { FutureCommandEntity } from '../entities/future-command.entity';

@CommandHandler(CreateFutureCommand)
export class CreateFutureCommandHandler implements ICommandHandler<CreateFutureCommand> {
	private logger = new Logger(CreateFutureCommandHandler.name);

	constructor(
		private eventEmitter: EventEmitter2,
		private readonly walletService: IWallet,
		private readonly entityManager: EntityManager
	) {}

	async execute(command: CreateFutureCommand) {
		this.logger.debug('execute');

		const { data, user } = command;

		if (data.type === FutureCommandType.LIMIT && (!data.expectPrice || !data.lossStopPrice)) {
			throw new BadRequestException('Type limit required expectPrice and lossStopPrice');
		}

		await this.entityManager.transaction(async (trx) => {
			await this.walletService.decrease(
				this.entityManager,
				DEFAULT_CURRENCY,
				data.quantity,
				user.id
			);

			await trx.getRepository(FutureCommandEntity).save(data);
		});

		this.eventEmitter.emit('command.created', data.coinName);

		return 'Create Command successfully';
	}
}
