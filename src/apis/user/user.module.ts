import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackingEntity } from '../stacking/entities/stacking.entity';
import { VerifyUserEntity } from '../verify-user/entities/verify-user.entity';
import { PendingWalletEntity } from '../wallet/entities/pending-wallet.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { OTPEntity } from './entities/otp.entity';
import { ProfileEntity } from './entities/profile.entity';
import { RefreshTokenEntity } from './entities/refreshToken.entity';
import { UserEntity } from './entities/user.entity';
import { CreateUserHandler } from './handlers/create-user.handler';
import { GetAllUserPaginatedHandler } from './handlers/get-all-user-paginated.handler';
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
			PendingWalletEntity
		])
	],
	controllers: [UserController],
	providers: [
		{
			provide: IUserService,
			useClass: UserService
		},
		CreateUserHandler,
		GetAllUserPaginatedHandler,
		GetOneUserByIdHandler,
		RemoveUserByIdHandler,
		UpdateUserByIdHandler,
		UpsertHandler
	],
	exports: [IUserService]
})
export class UserModule {}
