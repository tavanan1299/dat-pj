import { PaginationDto, User } from '@app/common';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { GetAllNotificationPaginatedCommand } from './command/get-all-notification.command';
import { GetOneNotificationByIdCommand } from './command/get-onenotification.command';
import { INotification } from './notification.interface';

@Controller('notification')
export class NotificationController {
	constructor(
		private readonly notificationService: INotification,
		private readonly commandBus: CommandBus
	) {}

	@Post()
	async create(@Body() data: any) {
		await this.notificationService.sendNotification(
			data,
			'de74f38b-aa8b-4506-9fd0-cd0e41e5b747',
			{
				body: 'You have had an amount deducted from your wallet',
				coinName: 'Bit Coin',
				amount: 100,
				remainBalance: 900
			}
		);

		return 'success';
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
}
