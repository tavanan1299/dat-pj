import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationReceives } from './entities/notification-receive.entity';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { INotification } from './notification.interface';
import { NotificationService } from './notification.service';

@Module({
	imports: [TypeOrmModule.forFeature([Notification, NotificationReceives])],
	controllers: [NotificationController],
	providers: [
		{
			provide: INotification,
			useClass: NotificationService
		}
	],
	exports: [INotification]
})
export class NotificationModule {}
