import { ApiController, ApiCreate, ApiGetOne, UseUserGuard, User } from '@app/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { CreateVerifyUserCommand } from './commands/create-verify-user.command';
import { GetOneVerifyUserByIdCommand } from './commands/get-one-verify-user.command';
import { CreateVerifyUserDto } from './dto/create-verify-user.dto';
import { VerifyUserEntity } from './entities/verify-user.entity';

@Controller('verify-user')
@ApiController('Verify User')
@UseUserGuard()
export class VerifyUserController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Verify user' })
	@ApiOkResponse({ description: 'Verify User successfully' })
	@Post()
	@ApiCreate(VerifyUserEntity, 'Verify User')
	create(@Body() verifyUser: CreateVerifyUserDto, @User() user: UserEntity) {
		return this.commandBus.execute(new CreateVerifyUserCommand({ user, data: verifyUser }));
	}

	@ApiOperation({ description: 'Get one verify' })
	@ApiOkResponse({ description: 'Get one verify successfully' })
	@Get(':id')
	@ApiGetOne(UserEntity, 'Verify User')
	getOne(@Param('id') id: string) {
		return this.commandBus.execute(new GetOneVerifyUserByIdCommand({ id }));
	}
}
