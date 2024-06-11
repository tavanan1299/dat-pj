import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { UserService } from '../user/user.service';
import { INotification } from './notification.interface';
import { Notification_Type } from './types';

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
	private logger = new Logger();

	constructor(
		private readonly notificationService: INotification,
		private readonly userService: UserService
	) {
		super();
	}

	async process(job: Job<any, any, string>): Promise<any> {
		const data = await this.sendNotification(job.data);
		return data;
	}

	async sendNotification(data: any) {
		this.logger.log('Processing send notification....');
		const DATA_NOTI: Notification_Type = {
			message: 'Message from admin',
			entity: 'transaction',
			entityKind: 'create',
			notiType: 'announcement'
		};
		const users = await this.userService.getAllUsers();
		for (const user of users) {
			console.log(data.content);
			await this.notificationService.sendNotification(DATA_NOTI, user.id, {
				body: data.content
			});
		}
		return;
	}
}
