import { ApiController, UseUserGuard, User } from '@app/common';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { CancelCommand } from './commands/cancel-command.command';
import { CreateCommand } from './commands/create-command.command';
import { CreateCommandDto } from './dto/create-command.dto';

@ApiController('Command')
@Controller('command')
@UseUserGuard()
export class CommandController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Create Command' })
	@ApiOkResponse({ description: 'Create Command successfully' })
	@Post()
	create(@Body() createCommand: CreateCommandDto, @User() user: UserEntity) {
		return this.commandBus.execute(new CreateCommand({ user, data: createCommand }));
	}

	@ApiOperation({ description: 'Cancel Command' })
	@ApiOkResponse({ description: 'Cancel Command successfully' })
	@Delete()
	delete(@Param('commandId') commandId: string, @User() user: UserEntity) {
		return this.commandBus.execute(new CancelCommand({ commandId, user }));
	}
}
