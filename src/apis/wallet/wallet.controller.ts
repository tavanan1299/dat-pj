import { ApiController, ApiGetAll, PaginationDto, UseUserGuard, User } from '@app/common';
import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { CreateWalletCommand } from './commands/create-wallet.command';
import { CreateWithdrawWalletCommand } from './commands/create-withdraw-wallet.command';
import { GetAllWalletPaginatedCommand } from './commands/get-all-wallet-command';
import { UpdateWalletCommand } from './commands/update-wallet-command';
import { WithdrawWalletCommand } from './commands/withdraw-wallet.command';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { CreateWithdrawWalletDto } from './dto/create-withdraw-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WithdrawWalletDto } from './dto/withdraw-wallet.dto';
import { PendingWalletEntity } from './entities/pending-wallet.entity';

@Controller('wallet')
@ApiController('Wallet')
@UseUserGuard()
export class WalletController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Create wallet' })
	@ApiOkResponse({ description: 'Create wallet successfully' })
	@Post('create-wallet')
	@HttpCode(200)
	create(@Body() createWallet: CreateWalletDto, @User() user: UserEntity) {
		return this.commandBus.execute(new CreateWalletCommand({ user, data: createWallet }));
	}

	@ApiOperation({ description: 'Create withdraw wallet' })
	@ApiOkResponse({ description: 'Create withdraw wallet successfully' })
	@Post('create-withdraw-wallet')
	@HttpCode(200)
	createWithdraw(
		@Body() createWithdrawWallet: CreateWithdrawWalletDto,
		@User() user: UserEntity
	) {
		return this.commandBus.execute(
			new CreateWithdrawWalletCommand({ user, data: createWithdrawWallet })
		);
	}

	@ApiOperation({ description: 'Get list wallet' })
	@ApiOkResponse({ description: 'Get list wallet successfully' })
	@Get()
	@ApiGetAll(PendingWalletEntity, 'pendingWallet')
	getAll(@Query() query: PaginationDto) {
		return this.commandBus.execute(new GetAllWalletPaginatedCommand({ query }));
	}

	@ApiOperation({ description: 'Update wallet' })
	@ApiOkResponse({ description: 'Update wallet successfully' })
	@Post('update-wallet')
	@HttpCode(200)
	update(@Body() updateWallet: UpdateWalletDto, @User() user: UserEntity) {
		return this.commandBus.execute(new UpdateWalletCommand({ user, data: updateWallet }));
	}

	@ApiOperation({ description: 'Withdraw wallet' })
	@ApiOkResponse({ description: 'Withdraw wallet successfully' })
	@Post('withdraw-wallet')
	@HttpCode(200)
	withdraw(@Body() withdrawWallet: WithdrawWalletDto, @User() user: UserEntity) {
		return this.commandBus.execute(new WithdrawWalletCommand({ user, data: withdrawWallet }));
	}
}
