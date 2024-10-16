import { ApiController, PaginationDto, UseUserGuard, User } from '@common';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CancelMyCommands } from './commands/cancel-my-commands.command';
import { CancelMyFutureCommands } from './commands/cancel-my-future-commands.command';
import { GetAllUserPaginatedCommand } from './commands/get-all-user-paginated.command';
import { GetMyCommandCommand } from './commands/get-my-command.command';
import { GetMyFutureCommandCommand } from './commands/get-my-future-command.command';
import { GetMyFutureHistoriesCommand } from './commands/get-my-future-histories.command';
import { GetMyMarketHistoriesCommand } from './commands/get-my-market-histories.command';
import { GetMySpotHistoriesCommand } from './commands/get-my-spot-histories.command';
import { GetMyStacksCommand } from './commands/get-my-stacks.command';
import { GetMyTransHistoriesCommand } from './commands/get-my-trans-histories.command';
import { GetMyWalletCommand } from './commands/get-my-wallet.command';
import { GetOneUserByIdCommand } from './commands/get-one-user-by-id.command';
import { UpsertProfileCommand } from './commands/upsert-profile.command';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { UserEntity } from './entities/user.entity';

@Controller('user')
@ApiController('User')
@UseUserGuard()
export class UserController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Update profile' })
	@ApiOkResponse({ description: 'Update profile successfully' })
	@Put('profile')
	update(@Body() upsertProfile: UpsertProfileDto, @User() user: UserEntity) {
		return this.commandBus.execute(new UpsertProfileCommand({ user, data: upsertProfile }));
	}

	// @Post()
	// @ApiCreate(UserEntity, 'User')
	// create(@Body() createUserDto: CreateUserDto) {
	// 	return this.commandBus.execute(new CreateUserCommand({ data: createUserDto }));
	// }

	@ApiOperation({ description: 'Get all user' })
	@ApiOkResponse({ description: 'Get all user successfully' })
	@Get()
	getAll(@Query() query: PaginationDto) {
		return this.commandBus.execute(new GetAllUserPaginatedCommand({ query }));
	}

	@ApiOperation({ description: 'Get my transaction history' })
	@ApiOkResponse({ description: 'Get my transaction history successfully' })
	@Get('transaction-history/me')
	getMyTransHistories(@Query() query: PaginationDto, @User() user: UserEntity) {
		return this.commandBus.execute(new GetMyTransHistoriesCommand({ query, user }));
	}

	@ApiOperation({ description: 'Get my market history' })
	@ApiOkResponse({ description: 'Get my market history successfully' })
	@Get('market-history/me')
	getMyMarketHistories(@Query() query: PaginationDto, @User() user: UserEntity) {
		return this.commandBus.execute(new GetMyMarketHistoriesCommand({ query, user }));
	}

	@ApiOperation({ description: 'Get my limit history' })
	@ApiOkResponse({ description: 'Get my limit history successfully' })
	@Get('limit-history/me')
	getMySpotHistories(@Query() query: PaginationDto, @User() user: UserEntity) {
		return this.commandBus.execute(new GetMySpotHistoriesCommand({ query, user }));
	}

	@ApiOperation({ description: 'Get my future history' })
	@ApiOkResponse({ description: 'Get my future history successfully' })
	@Get('future-history/me')
	getMyFutureHistories(@Query() query: PaginationDto, @User() user: UserEntity) {
		return this.commandBus.execute(new GetMyFutureHistoriesCommand({ query, user }));
	}

	@ApiOperation({ description: 'Get my stacking' })
	@ApiOkResponse({ description: 'Get my stacking successfully' })
	@Get('stacking/me')
	getMyStacks(@Query() query: PaginationDto, @User() user: UserEntity) {
		return this.commandBus.execute(new GetMyStacksCommand({ query, user }));
	}

	@ApiOperation({ description: 'Get my limit command' })
	@ApiOkResponse({ description: 'Get my limit command successfully' })
	@Get('command/limit/me')
	getMyCommands(@Query() query: PaginationDto, @User() user: UserEntity) {
		return this.commandBus.execute(new GetMyCommandCommand({ query, user }));
	}

	@ApiOperation({ description: 'Get my profile' })
	@ApiOkResponse({ description: 'Get my profile successfully' })
	@Get('me')
	getMe(@User() user: UserEntity) {
		return this.commandBus.execute(new GetOneUserByIdCommand({ id: user.id }));
	}

	@ApiOperation({ description: 'Get one user' })
	@ApiOkResponse({ description: 'Get one user successfully' })
	@Get(':id')
	getOne(@Param('id') id: string) {
		return this.commandBus.execute(new GetOneUserByIdCommand({ id }));
	}

	@ApiOperation({ description: 'Cancel my limit commands' })
	@ApiOkResponse({ description: 'Cancel my limit commands successfully' })
	@Post('command/limit/me/cancel')
	deleteMyCommands(@User() user: UserEntity) {
		return this.commandBus.execute(new CancelMyCommands({ userId: user.id }));
	}

	@ApiOperation({ description: 'Get my future command' })
	@ApiOkResponse({ description: 'Get my future command successfully' })
	@Get('command/future/me')
	getMyFutureCommands(@Query() query: PaginationDto, @User() user: UserEntity) {
		return this.commandBus.execute(new GetMyFutureCommandCommand({ query, user }));
	}

	@ApiOperation({ description: 'Cancel my limit commands' })
	@ApiOkResponse({ description: 'Cancel my limit commands successfully' })
	@Post('command/future/me/close')
	deleteMyFutureCommands(@User() user: UserEntity) {
		return this.commandBus.execute(new CancelMyFutureCommands({ userId: user.id }));
	}

	@ApiOperation({ description: 'Get my wallet' })
	@ApiOkResponse({ description: 'Get my wallet successfully' })
	@Get('wallet/me')
	getMyWallet(@Query() query: PaginationDto, @User() user: UserEntity) {
		return this.commandBus.execute(new GetMyWalletCommand({ query, user }));
	}

	// @Patch(':id')
	// @ApiUpdate(UserEntity, 'User')
	// update(@Param('id') id: string, @Body() updateUserDto: UpdateUserByIdDto) {
	// 	return this.commandBus.execute(new UpdateUserByIdCommand({ id, data: updateUserDto }));
	// }

	// @Delete(':id')
	// @ApiDelete(UserEntity, 'User')
	// remove(@Param('id') id: string) {
	// 	return this.commandBus.execute(new RemoveUserByIdCommand({ id }));
	// }
}
