import { CommandsFactory } from '@app/modules/database/factories/command.factory';
import MainSeeder from '@app/modules/database/seeds/initialSeed';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';

config();

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
	type: 'postgres',
	host: configService.get<string>('DB_HOST'),
	port: configService.get<number>('DB_PORT'),
	username: configService.get<string>('DB_USERNAME'),
	password: configService.get<string>('DB_PASSWORD'),
	database: configService.get<string>('DB_NAME'),
	schema: configService.get<string>('DB_SCHEMA'),
	entities: ['**/*.entity.js'],
	migrationsTableName: `migrations`,
	migrations: [__dirname + '/src/modules/database/migrations/*{.ts,.js}'],
	synchronize: false,
	// additional config options brought by typeorm-extension
	factories: [CommandsFactory],
	seeds: [MainSeeder]
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
	await dataSource.synchronize(false);
	await runSeeders(dataSource);
	process.exit();
});
