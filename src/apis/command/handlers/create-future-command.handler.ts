import { IWallet } from '@app/apis/wallet/wallet.interface';
import { BINANCE_API, DEFAULT_CURRENCY } from '@app/common/constants/constant';
import { FutureCommandType } from '@app/common/enums/status.enum';
import { coinName2USDT } from '@app/common/helpers/common.helper';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';
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

		let isEntry: boolean = true,
			lessThanEntryPrice: boolean | undefined = undefined;

		if (data.type === FutureCommandType.LIMIT) {
			isEntry = data.type === FutureCommandType.LIMIT ? false : true;
			const binanceCoin = await axios.get(`${BINANCE_API}${coinName2USDT(data.coinName)}`);
			lessThanEntryPrice = binanceCoin.data.price < data.entryPrice;
		}

		const minusQuantity = +data.quantity / +data.leverage;

		await this.entityManager.transaction(async (trx) => {
			await this.walletService.decrease(trx, DEFAULT_CURRENCY, minusQuantity, user.id);

			await trx
				.getRepository(FutureCommandEntity)
				.save({ ...data, userId: user.id, isEntry, lessThanEntryPrice });
		});

		this.eventEmitter.emit('command.created', data.coinName);

		return 'Create Command successfully';
	}
}
