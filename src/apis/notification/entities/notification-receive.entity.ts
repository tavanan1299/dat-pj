import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Notification } from './notification.entity';

@Entity({ name: 'notificationReceive' })
export class NotificationReceives extends BaseEntity {
	@Column('jsonb', { nullable: true })
	metaData!: Record<string, unknown>;

	@Column({ default: false })
	isRead!: boolean;

	@Column({ nullable: true })
	readDate!: Date;

	@Column({ nullable: true })
	userId!: string;

	@Column({ nullable: true })
	notificationId!: string;

	@ManyToOne(() => UserEntity, (user) => user.notificationReceives)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@ManyToOne(() => Notification, (notification) => notification.notificationReceives)
	@JoinColumn({ name: 'notificationId', referencedColumnName: 'id' })
	notification!: Notification;
}
