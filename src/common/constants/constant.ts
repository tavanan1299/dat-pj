export const SKIP_AUTH = 'skipAuth';
export const KEY_PERMISSION = 'keyPermission';

export const INTEREST_RATE = {
	1: 5,
	2: 5,
	3: 10,
	4: 15,
	5: 20,
	6: 25
}; // lợi nhuận 1 tháng 5%, tương ứng cho 2, 3, 4, ...

export const DEFAULT_CURRENCY = 'usdt';

export const BINANCE_API = 'https://api.binance.com/api/v3/ticker/price?symbol=';

export const NotificationEntity = {
	TRANSACTION: 'transaction',
	NOTIFICATION: 'notification'
} as const;

export const NotificationEntityKind = {
	CREATE: 'create',
	UPDATE: 'update'
} as const;

export const NotificationType = {
	REMINDER: 'reminder',
	ANNOUNCEMENT: 'announcement'
} as const;

export const NotificationMessage = {
	BALANCE_FLUCTUATIONS: 'Balance fluctuations',
	MESSAGE_ADMIN: 'Message from admin',
	EXECUTED_COMMAND: 'Executed command'
} as const;
