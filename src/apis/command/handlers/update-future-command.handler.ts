import { IWallet } from '@app/apis/wallet/wallet.interface';
import { BINANCE_API, DEFAULT_CURRENCY, HistoryWalletType } from '@app/common/constants/constant';
import { ROLES } from '@app/common/constants/role.constant';
import { FutureCommandOrderType } from '@app/common/enums/status.enum';
import { coinName2USDT } from '@app/common/helpers/common.helper';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';
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

		if (futureCommand.userId === user.id || user.role.name === ROLES.ADMIN) {
			await this.entityManager.transaction(async (trx) => {
				const rollbackQuantity = futureCommand.quantity / futureCommand.leverage;
				let liquidationPrice = 0,
					liquidationPrice80 = 0;
				let lessThanEntryPrice = false;
				if (data.quantity || data.leverage || data.entryPrice) {
					const quantity = data.quantity || futureCommand.quantity;
					const leverage = data.leverage || futureCommand.leverage;
					const entryPrice = data.entryPrice || futureCommand.entryPrice;
					const updatedPrice = quantity / leverage;

					if (data.orderType === FutureCommandOrderType.LONG) {
						liquidationPrice = entryPrice * (1 - 1 / leverage);
						liquidationPrice80 =
							liquidationPrice + (entryPrice - liquidationPrice) * 0.2;
						if (data.expectPrice && data.expectPrice < entryPrice) {
							throw new BadRequestException(
								'expectPrice must be greater than entryPrice'
							);
						}
						if (data.lossStopPrice && data.lossStopPrice > entryPrice) {
							throw new BadRequestException(
								'lossStopPrice must be smaller than entryPrice'
							);
						}
					}

					if (data.orderType === FutureCommandOrderType.SHORT) {
						liquidationPrice = entryPrice * (1 + 1 / leverage);
						liquidationPrice80 =
							liquidationPrice - (liquidationPrice - entryPrice) * 0.2;
						if (data.expectPrice && data.expectPrice > entryPrice) {
							throw new BadRequestException(
								'expectPrice must be smaller than entryPrice'
							);
						}
						if (data.lossStopPrice && data.lossStopPrice < entryPrice) {
							throw new BadRequestException(
								'lossStopPrice must be greater than entryPrice'
							);
						}
					}

					const binanceCoin = await axios.get(
						`${BINANCE_API}${coinName2USDT(futureCommand.coinName)}`
					);
					lessThanEntryPrice = binanceCoin.data.price < entryPrice;

					if (updatedPrice > rollbackQuantity) {
						await this.walletService.decrease(
							trx,
							DEFAULT_CURRENCY,
							updatedPrice - rollbackQuantity,
							user.id,
							HistoryWalletType.FUTURE
						);
					} else {
						await this.walletService.increase(
							trx,
							DEFAULT_CURRENCY,
							rollbackQuantity - updatedPrice,
							user.id,
							HistoryWalletType.FUTURE
						);
					}
				}

				await trx.getRepository(FutureCommandEntity).update(commandId, {
					...data,
					liquidationPrice,
					lessThanEntryPrice,
					liquidationPrice80
				});

				this.eventEmitter.emit('command.created', futureCommand.coinName);
			});

			return 'Update future command success';
		}
		throw new BadRequestException('Access denied');
	}
}
