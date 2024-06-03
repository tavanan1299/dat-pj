import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { IWallet } from '@app/apis/wallet/wallet.interface';
import { CommandType } from '@app/common/enums/status.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ICommand } from '../command.interface';
import { CreateCommand } from '../commands/create-command.command';
import { CreateCommandDto } from '../dto/create-command.dto';

@CommandHandler(CreateCommand)
export class CreateCommandHandler implements ICommandHandler<CreateCommand> {
	private logger = new Logger(CreateCommandHandler.name);

	constructor(
		private readonly commandService: ICommand,
		private eventEmitter: EventEmitter2,
		private readonly walletService: IWallet
	) {}

	async execute(command: CreateCommand) {
		this.logger.debug('execute');

		const { data, user } = command;

		if (data.type === CommandType.SELL) {
			await this.validateSellCommand(data, user);
		}

		if (data.type === CommandType.BUY) {
			await this.commandService.create({
				...data,
				userId: user.id,
				lossStopPrice: undefined
			});
		} else {
			await this.commandService.create({ ...data, userId: user.id });
			await this.walletService.decrease(data.coinName, data.quantity, user.id);
		}

		this.eventEmitter.emit('command.created', data.coinName);

		return 'Create Command successfully';
	}

	private async validateSellCommand(data: CreateCommandDto, user: User) {
		if (!data.lossStopPrice) {
			throw new BadRequestException('Field lossStopPrice is required');
		}

		const wallet = await this.findUserWallet(data.coinName, user.id);

		if (!wallet) {
			throw new BadRequestException('Wallet not found');
		}

		if (wallet.quantity < data.quantity) {
			throw new BadRequestException('The balance in the wallet is not enough');
		}
	}

	private async findUserWallet(coinName: string, userId: string): Promise<WalletEntity | null> {
		return WalletEntity.findOne({
			where: {
				coinName,
				userId
			}
		});
	}
}
