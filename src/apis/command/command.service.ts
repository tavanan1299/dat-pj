import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { ICommand } from './command.interface';
import { CommandEntity } from './entities/command.entity';
import { BinanceToJob } from './types/binance-job.type';

@Injectable()
export class CommandService extends ICommand {
	notFoundMessage = 'Command not found';

	constructor(
		@InjectRepository(CommandEntity)
		private readonly commandRepo: Repository<CommandEntity>,

		@InjectQueue('binance:coin')
		private readonly binanceCoin: Queue
	) {
		super(commandRepo);
	}

	async addJobToQueue(data: BinanceToJob) {
		await this.binanceCoin.add('addBinanceJob', data);
	}
}
