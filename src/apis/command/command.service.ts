import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICommand } from './command.interface';
import { CommandEntity } from './entities/command.entity';

@Injectable()
export class CommandService extends ICommand {
	notFoundMessage = 'Command not found';

	constructor(
		@InjectRepository(CommandEntity)
		private readonly commandRepo: Repository<CommandEntity>
	) {
		super(commandRepo);
	}
}
