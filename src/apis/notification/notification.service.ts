import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
		private readonly notificationReceiveRepo: Repository<NotificationReceives>
	) {
		super(notificationRepo);
	}

	async sendNotification(
		data: Notification_Type,
		userId: string,
		metaData: Record<string, unknown>
	) {
		const notification = await this.createNotification(data);

		await this.saveNotificationReceives(notification, userId, metaData);
	}

	private async createNotification(data: Notification_Type) {
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
	) {
		const notificationReceive = new NotificationReceives();
		notificationReceive.notification = notification;
		notificationReceive.userId = userId;
		notificationReceive.metaData = metaData;

		await this.notificationReceiveRepo.save(notificationReceive);
	}
}
