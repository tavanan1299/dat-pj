import { ApiModule } from '@apis/api.module';
import { LoggerMiddleware } from '@common';
import { ConfigModule } from '@modules/configs';
import { CronModule } from '@modules/cron';
import { DatabaseModule } from '@modules/database';
import { I18NModule } from '@modules/i18n';
import { JwtModule } from '@modules/jwt';
import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { providers } from './app.provider';
import { QueueModule } from './modules/bull/bull.module';

@Module({
	imports: [
		ConfigModule,
		CronModule,
		DatabaseModule,
		JwtModule,
		EventEmitterModule.forRoot({
			maxListeners: 20
		}),
		I18NModule,
		QueueModule,
		CqrsModule.forRoot(),
		ApiModule,
		BullModule.registerQueue({
			name: 'binance:coin',
			prefix: 'trade-coin'
		})
	],
	controllers: [AppController],
	providers
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
