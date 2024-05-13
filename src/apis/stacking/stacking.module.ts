import { Module } from '@nestjs/common';
import { StackingController } from './stacking.controller';
import { StackingService } from './stacking.service';

@Module({
	controllers: [StackingController],
	providers: [StackingService]
})
export class StackingModule {}
