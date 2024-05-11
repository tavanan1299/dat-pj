import { ApiController, ApiGetAll, ApiGetOne, PaginationDto, User } from '@common';
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllUserPaginatedCommand } from './commands/get-all-user-paginated.command';
import { GetOneUserByIdCommand } from './commands/get-one-user-by-id.command';
import { UpsertProfileCommand } from './commands/upsert-profile.command';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { UserEntity } from './entities/user.entity';

@Controller('user')
@ApiController('User')
// @UseGuards(AuthGuard(AuthStrategy.USER_JWT))
export class UserController {
	constructor(private readonly commandBus: CommandBus) {}

	@Put('profile')
	update(@Body() upsertProfile: UpsertProfileDto, @User() user: UserEntity) {
		return this.commandBus.execute(new UpsertProfileCommand({ user, data: upsertProfile }));
	}

	// @Post()
	// @ApiCreate(UserEntity, 'User')
	// create(@Body() createUserDto: CreateUserDto) {
	// 	return this.commandBus.execute(new CreateUserCommand({ data: createUserDto }));
	// }

	@Get()
	@ApiGetAll(UserEntity, 'User')
	getAll(@Query() query: PaginationDto) {
		return this.commandBus.execute(new GetAllUserPaginatedCommand({ query }));
	}

	@Get(':id')
	@ApiGetOne(UserEntity, 'User')
	getOne(@Param('id') id: string) {
		return this.commandBus.execute(new GetOneUserByIdCommand({ id }));
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
