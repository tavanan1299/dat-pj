import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackingEntity } from './entities/stacking.entity';
import { CreateVerifyUserHandler } from './handlers/create-stacking.handler';
import { StackingController } from './stacking.controller';
import { IStacking } from './stacking.interface';
import { StackingService } from './stacking.service';

@Module({
	imports: [TypeOrmModule.forFeature([StackingEntity])],
	controllers: [StackingController],
	providers: [
		{
			provide: IStacking,
			useClass: StackingService
		},
		CreateVerifyUserHandler
	],
	exports: [IStacking]
})
export class StackingModule {}
