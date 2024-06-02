import { ApiController, UseUserGuard, User } from '@app/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { CreateMarketLogCommand } from './commands/create-market-log.command';
import { CreateMarketLogDto } from './dto/create-market-log.dto';

@ApiController('Market')
@Controller('market')
@UseUserGuard()
export class MarketController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Create Market Log' })
	@ApiOkResponse({ description: 'Create market log successfully' })
	@Post()
	@HttpCode(200)
	create(@Body() createMarketLog: CreateMarketLogDto, @User() user: UserEntity) {
		return this.commandBus.execute(new CreateMarketLogCommand({ user, data: createMarketLog }));
	}
}
