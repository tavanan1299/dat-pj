import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { IWallet } from '@app/apis/wallet/wallet.interface';
import { HistoryWalletType } from '@app/common/constants/constant';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateStackingCommand } from '../commands/create-stacking.command';
import { CreateStackingDtoWithUserId } from '../dto/create-stacking.dto';
import { StackingEntity } from '../entities/stacking.entity';

@CommandHandler(CreateStackingCommand)
export class CreateVerifyUserHandler implements ICommandHandler<CreateStackingCommand> {
	private logger = new Logger(CreateVerifyUserHandler.name);

	constructor(
		private readonly walletService: IWallet,
		@InjectEntityManager()
		private readonly entityManager: EntityManager
	) {}

	async execute(command: CreateStackingCommand): Promise<string> {
		this.logger.debug('execute');

		return await this.entityManager.transaction(async (trx): Promise<string> => {
			try {
				const { data, user } = command;

				const currentWallet = await trx.getRepository(WalletEntity).findOne({
					where: {
						userId: user.id,
						coinName: data.coinName
					}
				});

				if (!currentWallet) {
					throw new NotFoundException('Wallet not found!');
				}

				const saveQuantity = currentWallet.quantity - data.quantity;

				if (saveQuantity < 0) {
					throw new BadRequestException(
						'The amount of money in the wallet is not enough'
					);
				}

				await this.walletService.decrease(
					trx,
					data.coinName,
					data.quantity,
					user.id,
					HistoryWalletType.STACKING
				);
				await this.createStacking(trx, { ...data, userId: user.id });

				return 'Create Stacking successfully';
			} catch (error) {
				throw error;
			}
		});
	}

	private async createStacking(
		entityManager: EntityManager,
		stackingData: CreateStackingDtoWithUserId
	): Promise<void> {
		await entityManager.save(StackingEntity, stackingData);
	}
}
