import { CommandEntity } from '@app/apis/command/entities/command.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class MainSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
		const commandFactory = factoryManager.get(CommandEntity);
		await commandFactory.saveMany(1000);
	}
}
