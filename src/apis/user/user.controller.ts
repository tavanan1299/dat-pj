import { ApiController } from '@common';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller('user')
@ApiController('User')
// @UseGuards(AuthGuard(AuthStrategy.USER_JWT))
export class UserController {
	constructor(private readonly commandBus: CommandBus) {}

	// @Post()
	// @ApiCreate(UserEntity, 'User')
	// create(@Body() createUserDto: CreateUserDto) {
	// 	return this.commandBus.execute(new CreateUserCommand({ data: createUserDto }));
	// }

	// @Get()
	// @ApiGetAll(UserEntity, 'User')
	// getAll(@Query() query: PaginationDto) {
	// 	return this.commandBus.execute(new GetAllUserPaginatedCommand({ query }));
	// }

	// @Get(':id')
	// @ApiGetOne(UserEntity, 'User')
	// getOne(@Param('id') id: string) {
	// 	return this.commandBus.execute(new GetOneUserByIdCommand({ id }));
	// }

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
