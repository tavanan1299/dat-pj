import {
	NotificationEntity,
	NotificationEntityKind,
	NotificationMessage,
	NotificationType
} from '@app/common/constants/constant';

export type NotificationEntityWrap = (typeof NotificationEntity)[keyof typeof NotificationEntity];
export type NotificationEntityKindWrap =
	(typeof NotificationEntityKind)[keyof typeof NotificationEntityKind];
export type NotificationTypeWrap = (typeof NotificationType)[keyof typeof NotificationType];
export type NotificationMessageWrap =
	(typeof NotificationMessage)[keyof typeof NotificationMessage];

export type Notification_Type = {
	message: NotificationMessageWrap;
	entity: NotificationEntityWrap;
	entityKind: NotificationEntityKindWrap;
	notiType: NotificationTypeWrap;
};
