import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICommandLog } from './command-log.interface';
import { CommandLogEntity } from './entities/command-log.entity';

@Injectable()
export class CommandLogService extends ICommandLog {
	notFoundMessage = 'Command log Not Found!';

	constructor(
		@InjectRepository(CommandLogEntity)
		private readonly commandLogRepo: Repository<CommandLogEntity>
	) {
		super(commandLogRepo);
	}
}
