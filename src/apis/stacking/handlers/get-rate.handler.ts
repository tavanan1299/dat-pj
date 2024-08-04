import { IWallet } from '@app/apis/wallet/wallet.interface';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GetRateCommand } from '../commands/get-rate.command';
import { RateEntity } from '../entities/rate.entity';

@CommandHandler(GetRateCommand)
export class GetRateHandler implements ICommandHandler<GetRateCommand> {
	private logger = new Logger(GetRateHandler.name);

	constructor(
		private readonly walletService: IWallet,
		@InjectEntityManager()
		private readonly entityManager: EntityManager
	) {}

	async execute(_command: GetRateCommand) {
		this.logger.debug('execute');

		return (await RateEntity.find())[0];
	}
}
