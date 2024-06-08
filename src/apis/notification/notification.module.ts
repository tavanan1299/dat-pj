import { FirebaseService } from '@app/modules/firebase/firebase.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationReceives } from './entities/notification-receive.entity';
import { Notification } from './entities/notification.entity';
import { GetAllPaginationPaginatedHandler } from './handlers/get-all-notification.handler';
import { GetOneNotificationByIdHandler } from './handlers/get-one-notification.handler';
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
		},
		FirebaseService,
		GetAllPaginationPaginatedHandler,
		GetOneNotificationByIdHandler
	],
	exports: [INotification]
})
export class NotificationModule {}
