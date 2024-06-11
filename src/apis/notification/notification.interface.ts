import { BaseService } from '@common';
import { PushNotificationDto } from './dto/push-notification.dto';
import { Notification } from './entities/notification.entity';
import { Notification_Type } from './types';

export abstract class INotification extends BaseService<Notification> {
    abstract sendNotification(data: Notification_Type, userId: string, metaData: Record<string, unknown>): Promise<void>;
    abstract sendNotificationToAllUsers(data: PushNotificationDto): Promise<void>;
}
