import { ApiController, ApiGetAll, PaginationDto, UseUserGuard, User } from '@app/common';
import { PERMISSIONS } from '@app/common/constants/permission.constant';
import { AccessPermissions } from '@app/common/decorators/permission.decorator';
import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { ApprovePendingWalletCommand } from './commands/approve-pending-wallet.command';
import { GetAllPendingWalletPaginatedCommand } from './commands/get-all-pending-wallet-command';
import { TransferPendingWalletCommand } from './commands/transfer-pending-wallet-command';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PendingWalletEntity } from './entities/pending-wallet.entity';

@Controller('wallet')
@ApiController('Wallet')
@UseUserGuard()
export class WalletController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ description: 'Get list pending wallet' })
	@ApiOkResponse({ description: 'Get list pending wallet successfully' })
	@Get('request')
	@ApiGetAll(PendingWalletEntity, 'pendingWallet')
	getAll(@Query() query: PaginationDto) {
		return this.commandBus.execute(new GetAllPendingWalletPaginatedCommand({ query }));
	}

	@ApiOperation({ description: 'Request transfer wallet' })
	@ApiOkResponse({ description: 'Request transfer successfully' })
	@Post('request-transfer')
	@HttpCode(200)
	update(@Body() updateWallet: UpdateWalletDto, @User() user: UserEntity) {
		return this.commandBus.execute(
			new TransferPendingWalletCommand({ user, data: updateWallet })
		);
	}

	@ApiOperation({ description: 'Request admin approve transfer' })
	@ApiOkResponse({ description: 'Request admin approve transfer successfully' })
	@AccessPermissions(PERMISSIONS.ADMIN)
	@Patch(':id/approve')
	@HttpCode(200)
	approveTransfer(@Param('id') id: string) {
		return this.commandBus.execute(new ApprovePendingWalletCommand({ id }));
	}
}
