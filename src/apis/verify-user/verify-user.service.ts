import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IVerifyUserService } from './IVerifyUserService.interface';
import { VerifyUserEntity } from './entities/verify-user.entity';

@Injectable()
export class VerifyUserService extends IVerifyUserService {
	notFoundMessage = 'User Verify Not Found!';

	constructor(
		@InjectRepository(VerifyUserEntity)
		private readonly verifyuserRepo: Repository<VerifyUserEntity>
	) {
		super(verifyuserRepo);
	}
}
