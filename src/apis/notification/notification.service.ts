import { FirebaseService } from '@app/modules/firebase/firebase.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { NotificationReceives } from './entities/notification-receive.entity';
import { Notification } from './entities/notification.entity';
import { INotification } from './notification.interface';
import { Notification_Type } from './types';

@Injectable()
export class NotificationService extends INotification {
	notFoundMessage = 'Notifictaion not found';

	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepo: Repository<Notification>,
		@InjectRepository(NotificationReceives)
		private readonly notificationReceiveRepo: Repository<NotificationReceives>,
		private readonly firebaseService: FirebaseService
	) {
		super(notificationRepo);
	}

	async sendNotification(
		data: Notification_Type,
		userId: string,
		metaData: Record<string, unknown>
	): Promise<void> {
		const notification = await this.createNotification(data);

		await this.saveNotificationReceives(notification, userId, metaData);

		const user = await UserEntity.findOne({
			where: {
				id: userId
			}
		});

		if (user) {
			await this.firebaseService.sendNotification(user.fcmToken, {
				title: data.message,
				body: (metaData.body as string) || 'Notification'
			});
		}
	}

	private async createNotification(data: Notification_Type): Promise<Notification> {
		const { entity, entityKind, notiType, message } = data;

		const existingNotification = await this.notificationRepo.findOne({
			where: {
				message,
				entity,
				entityKind,
				notiType
			}
		});

		if (existingNotification) return existingNotification;

		const newNotification = this.notificationRepo.create({ ...data });

		await this.notificationRepo.save(newNotification);

		return newNotification;
	}

	private async saveNotificationReceives(
		notification: Notification,
		userId: string,
		metaData: Record<string, unknown>
	): Promise<void> {
		const notificationReceive = new NotificationReceives();
		notificationReceive.notification = notification;
		notificationReceive.userId = userId;
		notificationReceive.metaData = metaData;

		await this.notificationReceiveRepo.save(notificationReceive);
	}
}
