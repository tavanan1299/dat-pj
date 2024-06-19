import { DEFAULT_CURRENCY } from '@app/common/constants/constant';
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
		if (command.orderType === FutureCommandOrderType.LONG) {
			if (price > command.entryPrice) {
				const winAmount = this.calcAmount(
					price,
					command.entryPrice,
					command.quantity,
					command.leverage,
					false
				);
				await this.walletService.increase(trx, DEFAULT_CURRENCY, winAmount, command.userId);
			} else {
				const loseAmount = this.calcAmount(
					command.entryPrice,
					price,
					command.quantity,
					command.leverage,
					true
				);
				await this.walletService.decrease(
					trx,
					DEFAULT_CURRENCY,
					loseAmount,
					command.userId
				);
			}
		} else {
			if (price > command.entryPrice) {
				const loseAmount = this.calcAmount(
					price,
					command.entryPrice,
					command.quantity,
					command.leverage,
					true
				);
				await this.walletService.decrease(
					trx,
					DEFAULT_CURRENCY,
					loseAmount,
					command.userId
				);
			} else {
				const winAmount = this.calcAmount(
					command.entryPrice,
					price,
					command.quantity,
					command.leverage,
					false
				);
				await this.walletService.increase(trx, DEFAULT_CURRENCY, winAmount, command.userId);
			}
		}
		// add logs
		await trx.getRepository(FutureCommandLogEntity).save({
			...rest,
			status: CommonStatus.SUCCESS,
			desc: 'Cancel'
		});
	}

	calcAmount(
		bigPrice: number,
		smallPrice: number,
		quantity: number,
		leverage: number,
		isLose = true
	) {
		if (isLose) {
			return ((bigPrice - smallPrice) / bigPrice) * quantity - quantity / leverage;
		}

		return ((bigPrice - smallPrice) / smallPrice) * quantity + quantity / leverage;
	}
}
