import { NotificationModule } from '@app/apis/notification/notification.module';
import { WalletModule } from '@app/apis/wallet/wallet.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronController } from './cron.controller';
import { ICronService } from './cron.interface';
import { CronService } from './cron.service';

@Module({
	imports: [ScheduleModule.forRoot(), NotificationModule, WalletModule],
	controllers: [CronController],
	providers: [
		{
			provide: ICronService,
			useClass: CronService
		}
	]
})
export class CronModule {}
