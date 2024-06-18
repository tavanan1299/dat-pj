import { BaseEntity } from '@app/common';
import {
	NotificationEntity,
	NotificationEntityKind,
	NotificationType
} from '@app/common/constants/constant';
import { Column, Entity, OneToMany } from 'typeorm';
import { NotificationReceives } from './notification-receive.entity';

@Entity({ name: 'notification' })
export class Notification extends BaseEntity {
	@Column({ nullable: true })
	message!: string;

	@Column({ default: NotificationEntity.TRANSACTION })
	entity!: string;

	@Column({ default: NotificationEntityKind.CREATE })
	entityKind!: string;

	@Column({ default: NotificationType.ANNOUNCEMENT })
	notiType!: string;

	@OneToMany(() => NotificationReceives, (notiReceive) => notiReceive.notification)
	notificationReceives!: NotificationReceives[];
}
