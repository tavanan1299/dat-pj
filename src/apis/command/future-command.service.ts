import { DEFAULT_CURRENCY } from '@app/common/constants/constant';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IWallet } from '../wallet/wallet.interface';
import { FutureCommandEntity } from './entities/future-command.entity';
import { IFutureCommand } from './future-command.interface';

@Injectable()
export class FutureCommandService extends IFutureCommand {
	notFoundMessage = 'Command not found';

	constructor(
		@InjectRepository(FutureCommandEntity)
		private readonly futureCommandRepo: Repository<FutureCommandEntity>,
		private readonly walletService: IWallet
	) {
		super(futureCommandRepo);
	}

	async handleFutureCommand(trx: EntityManager, command: FutureCommandEntity, price: number) {
		if (price > command.entryPrice) {
			const winAmount =
				((price - command.entryPrice) / command.entryPrice) * command.quantity +
				command.quantity / command.leverage;
			await this.walletService.increase(trx, DEFAULT_CURRENCY, winAmount, command.userId);
		} else {
			const loseAmount =
				((command.entryPrice - price) / command.entryPrice) * command.quantity -
				command.quantity / command.leverage;
			await this.walletService.decrease(trx, DEFAULT_CURRENCY, loseAmount, command.userId);
		}
	}
}
