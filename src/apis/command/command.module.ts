import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from '../wallet/wallet.module';
import { CommandController } from './command.controller';
import { ICommand } from './command.interface';
import { CommandProcessor } from './command.processor';
import { CommandService } from './command.service';
import { CommandEntity } from './entities/command.entity';
import { FutureCommandEntity } from './entities/future-command.entity';
import { IFutureCommand } from './future-command.interface';
import { FutureCommandService } from './future-command.service';
import { CancelCommandHandler } from './handlers/cancel-command.handler';
import { CancelFutureCommandHandler } from './handlers/cancel-future-command.handler';
import { CreateCommandHandler } from './handlers/create-command.handler';
import { CreateFutureCommandHandler } from './handlers/create-future-command.handler';
import { UpdateFutureCommandHandler } from './handlers/update-future-command.handler';

@Module({
	imports: [TypeOrmModule.forFeature([CommandEntity, FutureCommandEntity]), WalletModule],
	controllers: [CommandController],
	providers: [
		{
			provide: ICommand,
			useClass: CommandService
		},
		{
			provide: IFutureCommand,
			useClass: FutureCommandService
		},
		CreateCommandHandler,
		CancelCommandHandler,
		CreateFutureCommandHandler,
		CancelFutureCommandHandler,
		UpdateFutureCommandHandler,
		CommandProcessor
	],
	exports: [ICommand]
})
export class CommandModule {}
