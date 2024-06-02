import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandController } from './command.controller';
import { ICommand } from './command.interface';
import { CommandProcessor } from './command.processor';
import { CommandService } from './command.service';
import { CommandEntity } from './entities/command.entity';
import { CancelCommandHandler } from './handlers/cancel-command.handler';
import { CreateCommandHandler } from './handlers/create-command.handler';

@Module({
	imports: [TypeOrmModule.forFeature([CommandEntity])],
	controllers: [CommandController],
	providers: [
		{
			provide: ICommand,
			useClass: CommandService
		},
		CreateCommandHandler,
		CancelCommandHandler,
		CommandProcessor
	],
	exports: [ICommand]
})
export class CommandModule {}
