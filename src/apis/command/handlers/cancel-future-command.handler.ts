import { BINANCE_API } from '@app/common/constants/constant';
import { ROLES } from '@app/common/constants/role.constant';
import { coinName2USDT } from '@app/common/helpers/common.helper';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import axios from 'axios';
import { EntityManager } from 'typeorm';
import { CancelFutureCommand } from '../commands/cancel-future-command.command';
import { FutureCommandEntity } from '../entities/future-command.entity';
import { IFutureCommand } from '../future-command.interface';

@CommandHandler(CancelFutureCommand)
export class CancelFutureCommandHandler implements ICommandHandler<CancelFutureCommand> {
	private logger = new Logger(CancelFutureCommandHandler.name);

	constructor(
		private readonly entityManager: EntityManager,
		private readonly futureCommandService: IFutureCommand
	) {}

	async execute(command: CancelFutureCommand) {
		this.logger.debug('execute');

		const { commandId, user } = command;

		try {
			return this.entityManager.transaction(async (trx) => {
				const currentCommand = await trx.getRepository(FutureCommandEntity).findOneBy({
					id: commandId
				});

				if (!currentCommand) {
					throw new BadRequestException('Command not found');
				}

				if (currentCommand.userId === user.id || user.role.name === ROLES.ADMIN) {
					const binanceCoin = await axios.get(
						`${BINANCE_API}${coinName2USDT(currentCommand.coinName)}`
					);

					await this.futureCommandService.handleFutureCommand(
						trx,
						currentCommand,
						binanceCoin.data.price
					);

					// if (binanceCoin.data.price > currentCommand.entryPrice) {
					// 	const winAmount =
					// 		Math.abs(currentCommand.entryPrice - binanceCoin.data.price) *
					// 			currentCommand.leverage +
					// 		currentCommand.quantity;
					// 	await this.walletService.increase(
					// 		trx,
					// 		currentCommand.coinName,
					// 		winAmount,
					// 		currentCommand.userId
					// 	);
					// } else {
					// 	const loseAmount =
					// 		Math.abs(currentCommand.entryPrice - binanceCoin.data.price) *
					// 			currentCommand.leverage -
					// 		currentCommand.quantity;
					// 	await this.walletService.increase(
					// 		trx,
					// 		currentCommand.coinName,
					// 		loseAmount,
					// 		currentCommand.userId
					// 	);
					// }

					await trx.getRepository(FutureCommandEntity).remove(currentCommand);

					return 'Cancel Command successfully';
				}

				throw new BadRequestException('Access denied');
			});
		} catch (error) {
			throw error;
		}
	}
}
