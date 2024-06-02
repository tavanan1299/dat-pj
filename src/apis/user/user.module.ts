import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICommand } from '../command/command.interface';
import { CommandService } from '../command/command.service';
import { CommandEntity } from '../command/entities/command.entity';
import { WalletLogEntity } from '../log/wallet-log/entities/wallet-log.entity';
import { IWalletLog } from '../log/wallet-log/wallet-log.interface';
import { WalletLogService } from '../log/wallet-log/wallet-log.service';
import { MarketLogEntity } from '../market/entities/market-log.entity';
import { StackingEntity } from '../stacking/entities/stacking.entity';
import { IStacking } from '../stacking/stacking.interface';
import { StackingService } from '../stacking/stacking.service';
import { VerifyUserEntity } from '../verify-user/entities/verify-user.entity';
import { PendingWalletEntity } from '../wallet/entities/pending-wallet.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { OTPEntity } from './entities/otp.entity';
import { ProfileEntity } from './entities/profile.entity';
import { RefreshTokenEntity } from './entities/refreshToken.entity';
import { UserEntity } from './entities/user.entity';
import { CreateUserHandler } from './handlers/create-user.handler';
import { GetAllUserPaginatedHandler } from './handlers/get-all-user-paginated.handler';
import { GetMyCommandHandler } from './handlers/get-my-command.handler';
import { GetMyStacksHandler } from './handlers/get-my-stacks.handler';
import { GetMyTransHistoriesHandler } from './handlers/get-my-trans-histories.handler';
import { GetOneUserByIdHandler } from './handlers/get-one-user-by-id.handler';
import { RemoveUserByIdHandler } from './handlers/remove-user-by-id.handler';
import { UpdateUserByIdHandler } from './handlers/update-user-by-id.handler';
import { UpsertHandler } from './handlers/upsert-profile.handler';
import { UserController } from './user.controller';
import { IUserService } from './user.interface';
import { UserService } from './user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			OTPEntity,
			RefreshTokenEntity,
			ProfileEntity,
			VerifyUserEntity,
			StackingEntity,
			WalletEntity,
			PendingWalletEntity,
			MarketLogEntity,
			WalletLogEntity,
			CommandEntity
		])
	],
	controllers: [UserController],
	providers: [
		{
			provide: IUserService,
			useClass: UserService
		},
		{
			provide: IWalletLog,
			useClass: WalletLogService
		},
		{
			provide: IStacking,
			useClass: StackingService
		},
		{
			provide: ICommand,
			useClass: CommandService
		},
		CreateUserHandler,
		GetAllUserPaginatedHandler,
		GetOneUserByIdHandler,
		RemoveUserByIdHandler,
		UpdateUserByIdHandler,
		UpsertHandler,
		GetMyTransHistoriesHandler,
		GetMyStacksHandler,
		GetMyCommandHandler
	],
	exports: [IUserService]
})
export class UserModule {}
