import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IVerifyUserService } from './IVerifyUserService.interface';
import { VerifyUserEntity } from './entities/verify-user.entity';
import { CreateVerifyUserHandler } from './handlers/create-verify-user.handler';
import { GetOneVerifyUserByIdHandler } from './handlers/get-one-verify-user.handler';
import { VerifyUserController } from './verify-user.controller';
import { VerifyUserService } from './verify-user.service';

@Module({
	imports: [TypeOrmModule.forFeature([VerifyUserEntity])],
	controllers: [VerifyUserController],
	providers: [
		{
			provide: IVerifyUserService,
			useClass: VerifyUserService
		},
		CreateVerifyUserHandler,
		GetOneVerifyUserByIdHandler
	],
	exports: [IVerifyUserService]
})
export class VerifyUserModule {}
