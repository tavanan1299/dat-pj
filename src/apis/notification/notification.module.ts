import { FirebaseService } from '@app/modules/firebase/firebase.service';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { NotificationReceives } from './entities/notification-receive.entity';
import { Notification } from './entities/notification.entity';
import { GetAllPaginationPaginatedHandler } from './handlers/get-all-notification.handler';
import { GetOneNotificationByIdHandler } from './handlers/get-one-notification.handler';
import { PushNotificationToAllUsersHandler } from './handlers/push-all-notification.handler';
import { PushOneNotificationByIdHandler } from './handlers/push-one-notification.handler';
import { NotificationController } from './notification.controller';
import { INotification } from './notification.interface';
import { NotificationProcessor } from './notification.processor';
import { NotificationService } from './notification.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Notification, NotificationReceives, UserEntity]),
		BullModule.registerQueue({
			name: 'notification',
			prefix: 'notif'
		})
	],
	controllers: [NotificationController],
	providers: [
		{
			provide: INotification,
			useClass: NotificationService
		},
		FirebaseService,
		GetAllPaginationPaginatedHandler,
		GetOneNotificationByIdHandler,
		PushOneNotificationByIdHandler,
		PushNotificationToAllUsersHandler,
		NotificationProcessor,
		UserService
	],
	exports: [INotification]
})
export class NotificationModule {}
