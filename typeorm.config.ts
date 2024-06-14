import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
	type: 'postgres',
	host: configService.get<string>('DB_HOST'),
	port: configService.get<number>('DB_HOST_PORT'),
	username: configService.get<string>('DB_USERNAME'),
	password: configService.get<string>('DB_PASSWORD'),
	database: configService.get<string>('DB_NAME'),
	schema: configService.get<string>('DB_SCHEMA'),
	entities: ['**/*.entity.js'],
	migrationsTableName: `migrations`,
	migrations: [__dirname + '/src/modules/database/migrations/*{.ts,.js}'],
	synchronize: false
	// ssl: true,
	// extra: {
	// 	ssl: {
	// 		rejectUnauthorized: false
	// 	}
	// }
});
