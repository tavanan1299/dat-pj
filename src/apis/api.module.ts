import { MailModule } from '@app/modules/mail';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { VerifyUserModule } from './verify-user/verify-user.module';

@Module({
	imports: [UserModule, AuthModule, MailModule, StorageModule, VerifyUserModule]
})
export class ApiModule {}
