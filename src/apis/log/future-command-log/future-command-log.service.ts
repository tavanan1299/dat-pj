import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FutureCommandLogEntity } from './entities/future-command-log.entity';
import { IFutureCommandLog } from './future-command-log.interface';

@Injectable()
export class FutureCommandLogService extends IFutureCommandLog {
	notFoundMessage = 'Command log Not Found!';

	constructor(
		@InjectRepository(FutureCommandLogEntity)
		private readonly futureCommandLogRepo: Repository<FutureCommandLogEntity>
	) {
		super(futureCommandLogRepo);
	}
}
