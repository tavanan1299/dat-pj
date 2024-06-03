import { Body, Controller, Post } from '@nestjs/common';
import { INotification } from './notification.interface';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: INotification) {}

	@Post()
	async create(@Body() data: any) {
		await this.notificationService.sendNotification(
			data,
			'1f7d8b1b-a7a3-4297-aa11-d6ad6fdf9744',
			{
				body: 'You have had an amount deducted from your wallet',
				coinName: 'Bit Coin',
				amount: 100,
				remainBalance: 900
			}
		);

		return 'success';
	}
}
