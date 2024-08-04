import { ApiController, ApiCreate, UseUserGuard, User } from '@app/common';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { CreateStackingCommand } from './commands/create-stacking.command';
import { GetRateCommand } from './commands/get-rate.command';
import { CreateStackingDto } from './dto/create-stacking.dto';
import { StackingEntity } from './entities/stacking.entity';

@ApiController('Stacking')
@Controller('stacking')
@UseUserGuard()
export class StackingController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Create Stacking' })
	@ApiOkResponse({ description: 'Create stacking successfully' })
	@Post()
	@ApiCreate(StackingEntity, 'Stacking')
	create(@Body() createStacking: CreateStackingDto, @User() user: UserEntity) {
		return this.commandBus.execute(new CreateStackingCommand({ user, data: createStacking }));
	}

	@ApiOperation({ description: 'Get Rate' })
	@ApiOkResponse({ description: 'Get rate successfully' })
	@Get('rate')
	@ApiCreate(StackingEntity, 'Rate')
	getRate() {
		return this.commandBus.execute(new GetRateCommand({}));
	}
}
