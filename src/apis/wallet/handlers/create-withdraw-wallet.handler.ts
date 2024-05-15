import { UserEntity } from '@app/apis/user/entities/user.entity';
import { WalletType } from '@app/common/enums/wallet.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateWithdrawWalletCommand } from '../commands/create-withdraw-wallet.command';
import { PendingWalletEntity } from '../entities/pending-wallet.entity';

@CommandHandler(CreateWithdrawWalletCommand)
export class CreateWithdrawWalletHandler implements ICommandHandler<CreateWithdrawWalletCommand> {
	private logger = new Logger(CreateWithdrawWalletHandler.name);

	constructor() {}

	async execute(command: CreateWithdrawWalletCommand) {
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
				userId: user.id,
				type: WalletType.WITHDRAW
			});
			await PendingWalletEntity.save(newPendingWallet);

			return 'Create withdraw coin pending wallet successfully!';
		} catch (error: any) {
			console.log(error);
			throw error;
		}
	}
}
