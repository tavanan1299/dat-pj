import { MailModule } from '@app/modules/mail';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';

@Module({
	imports: [UserModule, AuthModule, MailModule, StorageModule]
})
export class ApiModule {}
