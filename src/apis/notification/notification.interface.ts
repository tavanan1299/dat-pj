import { BaseService } from '@common';
import { Notification } from './entities/notification.entity';
import { Notification_Type } from './types';

export abstract class INotification extends BaseService<Notification> {
    abstract sendNotification(data: Notification_Type, userId: string, metaData: Record<string, unknown>): Promise<void>;
}
