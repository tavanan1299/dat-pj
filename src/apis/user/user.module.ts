import { FirebaseService } from '@app/modules/firebase/firebase.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICommand } from '../command/command.interface';
import { CommandService } from '../command/command.service';
import { CommandEntity } from '../command/entities/command.entity';
import { FutureCommandEntity } from '../command/entities/future-command.entity';
import { IFutureCommand } from '../command/future-command.interface';
import { FutureCommandService } from '../command/future-command.service';
import { ICommandLog } from '../log/command-log/command-log.interface';
import { CommandLogService } from '../log/command-log/command-log.service';
import { CommandLogEntity } from '../log/command-log/entities/command-log.entity';
import { FutureCommandLogEntity } from '../log/future-command-log/entities/future-command-log.entity';
import { IFutureCommandLog } from '../log/future-command-log/future-command-log.interface';
import { FutureCommandLogService } from '../log/future-command-log/future-command-log.service';
import { WalletLogEntity } from '../log/wallet-log/entities/wallet-log.entity';
import { IWalletLog } from '../log/wallet-log/wallet-log.interface';
import { WalletLogService } from '../log/wallet-log/wallet-log.service';
import { MarketLogEntity } from '../market/entities/market-log.entity';
import { IMarket } from '../market/market.interface';
import { MarketService } from '../market/market.service';
import { NotificationReceives } from '../notification/entities/notification-receive.entity';
import { Notification } from '../notification/entities/notification.entity';
import { INotification } from '../notification/notification.interface';
import { NotificationService } from '../notification/notification.service';
import { StackingEntity } from '../stacking/entities/stacking.entity';
import { IStacking } from '../stacking/stacking.interface';
import { StackingService } from '../stacking/stacking.service';
import { VerifyUserEntity } from '../verify-user/entities/verify-user.entity';
import { PendingWalletEntity } from '../wallet/entities/pending-wallet.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { IWallet } from '../wallet/wallet.interface';
import { WalletService } from '../wallet/wallet.service';
import { OTPEntity } from './entities/otp.entity';
import { ProfileEntity } from './entities/profile.entity';
import { RefreshTokenEntity } from './entities/refreshToken.entity';
import { UserEntity } from './entities/user.entity';
import { CancelMyCommandsHandler } from './handlers/cancel-my-commands.handler';
import { CancelMyFutureCommandsHandler } from './handlers/cancel-my-future-commands.handler';
import { CreateUserHandler } from './handlers/create-user.handler';
import { GetAllUserPaginatedHandler } from './handlers/get-all-user-paginated.handler';
import { GetMyCommandHandler } from './handlers/get-my-command.handler';
import { GetMyFutureCommandHandler } from './handlers/get-my-future-command.handler';
import { GetMyFutureHistoriesHandler } from './handlers/get-my-future-histories.handler';
import { GetMyMarketHistoriesHandler } from './handlers/get-my-market-histories.handler';
import { GetMySpotHistoriesHandler } from './handlers/get-my-spot-histories.handler';
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
			CommandEntity,
			CommandLogEntity,
			FutureCommandEntity,
			Notification,
			NotificationReceives,
			FutureCommandLogEntity
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
		{
			provide: IMarket,
			useClass: MarketService
		},
		{
			provide: ICommandLog,
			useClass: CommandLogService
		},
		{
			provide: IFutureCommand,
			useClass: FutureCommandService
		},
		{
			provide: IWallet,
			useClass: WalletService
		},
		{
			provide: INotification,
			useClass: NotificationService
		},
		{
			provide: IFutureCommandLog,
			useClass: FutureCommandLogService
		},
		CreateUserHandler,
		GetAllUserPaginatedHandler,
		GetOneUserByIdHandler,
		RemoveUserByIdHandler,
		UpdateUserByIdHandler,
		UpsertHandler,
		GetMyTransHistoriesHandler,
		GetMyStacksHandler,
		GetMyCommandHandler,
		GetMyMarketHistoriesHandler,
		GetMySpotHistoriesHandler,
		CancelMyCommandsHandler,
		GetMyFutureCommandHandler,
		CancelMyFutureCommandsHandler,
		GetMyFutureHistoriesHandler,
		FirebaseService
	],
	exports: [IUserService]
})
export class UserModule {}
