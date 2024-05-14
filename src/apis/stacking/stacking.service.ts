import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StackingEntity } from './entities/stacking.entity';
import { IStacking } from './stacking.interface';

@Injectable()
export class StackingService extends IStacking {
	notFoundMessage = 'Stacking Not Found!';

	constructor(
		@InjectRepository(StackingEntity)
		private readonly verifyuserRepo: Repository<StackingEntity>
	) {
		super(verifyuserRepo);
	}
}
