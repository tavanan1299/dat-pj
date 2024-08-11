import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { IVerifyUserService } from './IVerifyUserService.interface';
import { VerifyUserEntity } from './entities/verify-user.entity';
import { ApproveVerifyUserHandler } from './handlers/approve-verify-user.handler';
import { GetAllVerifyUserPaginatedHandler } from './handlers/get-all-verify-user.handler';
import { GetOneVerifyUserByIdHandler } from './handlers/get-one-verify-user.handler';
import { UpdateVerifyUserHandler } from './handlers/update-verify-user.handler';
import { VerifyUserController } from './verify-user.controller';
import { VerifyUserService } from './verify-user.service';

@Module({
	imports: [TypeOrmModule.forFeature([VerifyUserEntity]), NotificationModule],
	controllers: [VerifyUserController],
	providers: [
		{
			provide: IVerifyUserService,
			useClass: VerifyUserService
		},
		UpdateVerifyUserHandler,
		GetOneVerifyUserByIdHandler,
		ApproveVerifyUserHandler,
		GetAllVerifyUserPaginatedHandler
	],
	exports: [IVerifyUserService]
})
export class VerifyUserModule {}
