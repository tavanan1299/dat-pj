import { UserEntity } from '@app/apis/user/entities/user.entity';
import { WalletType } from '@app/common/enums/wallet.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TransferPendingWalletCommand } from '../commands/transfer-pending-wallet-command';
import { PendingWalletEntity } from '../entities/pending-wallet.entity';
import { WalletEntity } from '../entities/wallet.entity';

@CommandHandler(TransferPendingWalletCommand)
export class TransferPendingWalletHandler implements ICommandHandler<TransferPendingWalletCommand> {
	private logger = new Logger(TransferPendingWalletHandler.name);

	constructor(
		@InjectEntityManager()
		private readonly entityManager: EntityManager
	) {}

	async execute(command: TransferPendingWalletCommand) {
		this.logger.debug('execute');
		return await this.entityManager.transaction(async (trx) => {
			try {
				const { data, user } = command;

				const currentUser = await UserEntity.findOne({
					where: { id: user.id },
					relations: ['verify']
				});
				if (!currentUser) {
					throw new BadRequestException('User not found');
				}

				const wallet = await WalletEntity.findOne({
					where: { userId: user.id, coinName: data.coinName }
				});

				if (data.type === WalletType.WITHDRAW) {
					if (!wallet || wallet?.quantity < data.quantity) {
						throw new BadRequestException('Your wallet is not enough');
					}

					if (!currentUser?.verify || currentUser?.verify?.isVerified == false) {
						throw new BadRequestException('User has not been verified by admin yet');
					}
				}

				const newPendingWallet = PendingWalletEntity.create({
					userId: user.id,
					...data
				});

				await PendingWalletEntity.save(newPendingWallet);

				return 'Request transfer coin successfully!';
			} catch (error: any) {
				throw error;
			}
		});
	}
}
