import { MailModule } from '@app/modules/mail';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [UserModule, AuthModule, MailModule]
})
export class ApiModule {}
