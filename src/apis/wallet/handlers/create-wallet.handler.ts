import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateWalletCommand } from '../commands/create-wallet.command';
import { PendingWalletEntity } from '../entities/pending-wallet.entity';

@CommandHandler(CreateWalletCommand)
export class CreateWalletHandler implements ICommandHandler<CreateWalletCommand> {
	private logger = new Logger(CreateWalletHandler.name);

	constructor() {}

	async execute(command: CreateWalletCommand) {
		try {
			this.logger.debug('execute');
			const { data, user } = command;

			const currentUser = await UserEntity.findOne({ where: { id: user.id } });
			if (!currentUser) {
				throw new BadRequestException('User not found.');
			}

			const newPendingWallet = PendingWalletEntity.create({
				coinName: data.coinName,
				quantity: data.quantity,
				userId: user.id
			});
			await PendingWalletEntity.save(newPendingWallet);

			return 'Create coin pending wallet successfully!';
		} catch (error: any) {
			console.log(error);
			throw error;
		}
	}
}
