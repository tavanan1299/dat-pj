import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from '../wallet/wallet.module';
import { RateEntity } from './entities/rate.entity';
import { StackingEntity } from './entities/stacking.entity';
import { CreateVerifyUserHandler } from './handlers/create-stacking.handler';
import { GetRateHandler } from './handlers/get-rate.handler';
import { StackingController } from './stacking.controller';
import { IStacking } from './stacking.interface';
import { StackingService } from './stacking.service';

@Module({
	imports: [TypeOrmModule.forFeature([StackingEntity, RateEntity]), WalletModule],
	controllers: [StackingController],
	providers: [
		{
			provide: IStacking,
			useClass: StackingService
		},
		CreateVerifyUserHandler,
		GetRateHandler
	],
	exports: [IStacking]
})
export class StackingModule {}
