import { ApiController, UseUserGuard, User } from '@app/common';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { CancelCommand } from './commands/cancel-command.command';
import { CreateCommand } from './commands/create-command.command';
import { CreateFutureCommand } from './commands/create-future-command.command';
import { CreateCommandDto } from './dto/create-command.dto';
import { CreateFutureCommandDto } from './dto/create-future-command.dto';

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
	@Delete('limit')
	deleteLimitCommand(@Param('commandId') commandId: string, @User() user: UserEntity) {
		return this.commandBus.execute(new CancelCommand({ commandId, user }));
	}

	@ApiOperation({ description: 'Create future command' })
	@ApiOkResponse({ description: 'Create future command successfully' })
	@Post('future')
	createFutureCommand(@Body() data: CreateFutureCommandDto, @User() user: UserEntity) {
		return this.commandBus.execute(new CreateFutureCommand({ user, data }));
	}
}
