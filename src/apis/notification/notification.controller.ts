import { ApiController, PaginationDto, UseUserGuard, User } from '@app/common';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { GetAllNotificationPaginatedCommand } from './command/get-all-notification.command';
import { GetOneNotificationByIdCommand } from './command/get-onenotification.command';
import { PushAllNotificationCommand } from './command/push-all-notification.command';
import { PushOneNotificationByIdCommand } from './command/push-one-notification.command';
import { PushNotificationForOneUser } from './dto/push-notification-for-one-user.dto';
import { PushNotificationDto } from './dto/push-notification.dto';
import { INotification } from './notification.interface';
import { NotificationProcessor } from './notification.processor';

@ApiController('Notification')
@Controller('notification')
@UseUserGuard()
export class NotificationController {
	constructor(
		private readonly notificationService: INotification,
		private readonly commandBus: CommandBus,
		private readonly notificationProcessor: NotificationProcessor
	) {}

	@Post()
	async create(@Body() data: any) {
		await this.notificationService.sendNotification(
			data,
			'cfb725f6-d0bf-482b-8c2f-c2390e844a62',
			{
				body: 'You have had an amount deducted from your wallet',
				coinName: 'Bit Coin',
				amount: 100,
				remainBalance: 900
			}
		);

		return 'success';
	}

	@ApiOperation({ description: 'Push all notification' })
	@ApiOkResponse({ description: 'Push all notification successfully' })
	@Post('send-all')
	pushAll(@Body() pushNotification: PushNotificationDto, @User() user: UserEntity) {
		return this.commandBus.execute(
			new PushAllNotificationCommand({ data: pushNotification, user })
		);
	}

	@ApiOperation({ description: 'Get all notification' })
	@ApiOkResponse({ description: 'Get all notification successfully' })
	@Get()
	getAll(@Query() query: PaginationDto, @User() user: UserEntity) {
		return this.commandBus.execute(new GetAllNotificationPaginatedCommand({ query, user }));
	}

	@ApiOperation({ description: 'Get one notification' })
	@ApiOkResponse({ description: 'Get one notification successfully' })
	@Get(':id')
	getOne(@Param('id') id: string, @User() user: UserEntity) {
		return this.commandBus.execute(new GetOneNotificationByIdCommand({ id, user }));
	}

	@ApiOperation({ description: 'Push one notification' })
	@ApiOkResponse({ description: 'Push one notification successfully' })
	@Post('send-one')
	pushOne(@Body() pushNotification: PushNotificationForOneUser, @User() user: UserEntity) {
		return this.commandBus.execute(
			new PushOneNotificationByIdCommand({ data: pushNotification, user })
		);
	}
}
