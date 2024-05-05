import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('DB_HOST'),
				port: configService.get<number>('DB_PORT'),
				username: configService.get<string>('DB_USERNAME'),
				password: configService.get<string>('DB_PASSWORD'),
				database: configService.get<string>('DB_NAME'),
				schema: configService.get<string>('DB_SCHEMA'),
				autoLoadEntities: true,
				migrationsTableName: `migrations`,
				migrations: [__dirname + '/migrations/*{.ts,.js}'],
				migrationsRun: true,
				synchronize: false
			})
		})
	]
})
export class DatabaseModule {}
