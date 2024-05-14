import {
	ApiController,
	ApiCreate,
	ApiGetOne,
	PaginationDto,
	UseUserGuard,
	User
} from '@app/common';
import { PERMISSIONS } from '@app/common/constants/permission.constant';
import { AccessPermissions } from '@app/common/decorators/permission.decorator';
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { ApproveVerifyUserCommand } from './commands/approve-verify-user.command';
import { GetAllVerifyUserPaginatedCommand } from './commands/get-all-verify-user-paginate.command';
import { GetOneVerifyUserByIdCommand } from './commands/get-one-verify-user.command';
import { UpdateVerifyUserCommand } from './commands/update-verify-user.command';
import { UpdateVerifyUserDto } from './dto/update-verify-user.dto';
import { VerifyUserEntity } from './entities/verify-user.entity';

@Controller('verify-user')
@ApiController('Verify User')
@UseUserGuard()
export class VerifyUserController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Update verify user' })
	@ApiOkResponse({ description: 'Update verify user successfully' })
	@Put()
	@ApiCreate(VerifyUserEntity, 'Verify User')
	update(@Body() verifyUser: UpdateVerifyUserDto, @User() user: UserEntity) {
		return this.commandBus.execute(new UpdateVerifyUserCommand({ user, data: verifyUser }));
	}

	@ApiOperation({ description: 'Get all verify' })
	@ApiOkResponse({ description: 'Get all verify successfully' })
	@Get()
	@ApiGetOne(UserEntity, 'Verify User')
	getAll(@Query() query: PaginationDto) {
		return this.commandBus.execute(new GetAllVerifyUserPaginatedCommand({ query }));
	}

	@ApiOperation({ description: 'Get one verify' })
	@ApiOkResponse({ description: 'Get one verify successfully' })
	@Get(':id')
	@ApiGetOne(UserEntity, 'Verify User')
	getOne(@Param('id') id: string) {
		return this.commandBus.execute(new GetOneVerifyUserByIdCommand({ id }));
	}

	@ApiOperation({ description: 'Approve verify' })
	@ApiOkResponse({ description: 'Approve verify successfully' })
	@AccessPermissions(PERMISSIONS.ADMIN)
	@Get(':id/approve')
	approveVerify(@Param('id') id: string) {
		return this.commandBus.execute(new ApproveVerifyUserCommand({ id }));
	}
}
