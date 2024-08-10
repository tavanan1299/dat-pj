import { ApiController, UseUserGuard, User } from '@app/common';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { CancelCommand } from './commands/cancel-command.command';
import { CancelFutureCommand } from './commands/cancel-future-command.command';
import { CreateCommand } from './commands/create-command.command';
import { CreateFutureCommand } from './commands/create-future-command.command';
import { UpdateFutureCommand } from './commands/update-future-command.command';
import { CloseFutureCommandDto } from './dto/close-future-command.dto';
import { CreateCommandDto } from './dto/create-command.dto';
import { CreateFutureCommandDto } from './dto/create-future-command.dto';
import { UpdateFutureCommandDto } from './dto/update-future-command.dto';

@ApiController('Command')
@Controller('command')
@UseUserGuard()
export class CommandController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Create limit command' })
	@ApiOkResponse({ description: 'Create limit command successfully' })
	@Post('limit')
	createLimitCommand(@Body() createCommand: CreateCommandDto, @User() user: UserEntity) {
		return this.commandBus.execute(new CreateCommand({ user, data: createCommand }));
	}

	@ApiOperation({ description: 'Cancel limit command' })
	@ApiOkResponse({ description: 'Cancel limit command successfully' })
	@Post('limit/:id/cancel')
	deleteLimitCommand(@Param('id') commandId: string, @User() user: UserEntity) {
		return this.commandBus.execute(new CancelCommand({ commandId, user }));
	}

	@ApiOperation({ description: 'Create future command' })
	@ApiOkResponse({ description: 'Create future command successfully' })
	@Post('future')
	createFutureCommand(@Body() data: CreateFutureCommandDto, @User() user: UserEntity) {
		return this.commandBus.execute(new CreateFutureCommand({ user, data }));
	}

	@ApiOperation({ description: 'Update future command' })
	@ApiOkResponse({ description: 'Update future command successfully' })
	@Patch('future/:id')
	UpdateFutureCommand(
		@Param('id') commandId: string,
		@Body() data: UpdateFutureCommandDto,
		@User() user: UserEntity
	) {
		return this.commandBus.execute(new UpdateFutureCommand({ commandId, data, user }));
	}

	@ApiOperation({ description: 'Close future command' })
	@ApiOkResponse({ description: 'Close future command successfully' })
	@Post('future/:id/close')
	deleteFutureCommand(
		@Param('id') commandId: string,
		@Body() data: CloseFutureCommandDto,
		@User() user: UserEntity
	) {
		return this.commandBus.execute(new CancelFutureCommand({ commandId, user, data }));
	}
}
