import { MailModule } from '@app/modules/mail';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { StackingModule } from './stacking/stacking.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';
import { VerifyUserModule } from './verify-user/verify-user.module';
import { WalletModule } from './wallet/wallet.module';
import { CommandModule } from './command/command.module';

@Module({
	imports: [
		UserModule,
		AuthModule,
		MailModule,
		StorageModule,
		VerifyUserModule,
		StackingModule,
		WalletModule,
		CommandModule
	]
})
export class ApiModule {}
