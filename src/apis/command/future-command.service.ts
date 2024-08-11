import { DEFAULT_CURRENCY, HistoryWalletType } from '@app/common/constants/constant';
import { CommonStatus, FutureCommandOrderType } from '@app/common/enums/status.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { FutureCommandLogEntity } from '../log/future-command-log/entities/future-command-log.entity';
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
		const { id, createdAt, updatedAt, deletedAt, lessThanEntryPrice, isEntry, ...rest } =
			command;

		const profit: number = this.calcProfit(
			command.entryPrice,
			price,
			command.quantity,
			command.orderType === FutureCommandOrderType.LONG ? true : false
		);

		const PNLClosed = command.quantity / command.leverage + profit;

		if (PNLClosed < 0) {
			await this.walletService.decrease(
				trx,
				DEFAULT_CURRENCY,
				Math.abs(PNLClosed),
				command.userId,
				HistoryWalletType.FUTURE
			);
		} else {
			await this.walletService.increase(
				trx,
				DEFAULT_CURRENCY,
				PNLClosed,
				command.userId,
				HistoryWalletType.FUTURE
			);
		}

		// add logs
		await trx.getRepository(FutureCommandLogEntity).save({
			...rest,
			status: CommonStatus.SUCCESS,
			desc: 'Cancel',
			PNLClosed,
			closedVolume: command.entryPrice * command.leverage,
			closingPrice: price,
			closedAt: new Date()
		});
	}

	calcProfit(entryPrice: number, outPrice: number, quantity: number, isLong = true) {
		if (isLong) {
			return (1 / entryPrice - 1 / outPrice) * quantity * outPrice;
		}

		return (1 / entryPrice - 1 / outPrice) * (quantity * -1) * outPrice;
	}
}
