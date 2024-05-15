import { ApiController, UseUserGuard, User } from '@app/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { CreateWalletCommand } from './commands/create-wallet.command';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallet')
@ApiController('Wallet')
export class WalletController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Create wallet' })
	@ApiOkResponse({ description: 'Create wallet successfully' })
	@UseUserGuard()
	@Post('create-wallet')
	@UseUserGuard()
	@HttpCode(200)
	create(@Body() createWallet: CreateWalletDto, @User() user: UserEntity) {
		return this.commandBus.execute(new CreateWalletCommand({ user, data: createWallet }));
	}
}
