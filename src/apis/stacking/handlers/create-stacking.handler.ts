import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateStackingCommand } from '../commands/create-stacking.command';
import { CreateStackingDtoWithUserId } from '../dto/create-stacking.dto';
import { StackingEntity } from '../entities/stacking.entity';
import { IStacking } from '../stacking.interface';

@CommandHandler(CreateStackingCommand)
export class CreateVerifyUserHandler implements ICommandHandler<CreateStackingCommand> {
	private logger = new Logger(CreateVerifyUserHandler.name);

	constructor(
		private readonly stackingService: IStacking,
		@InjectEntityManager()
		private readonly entityManager: EntityManager
	) {}

	async execute(command: CreateStackingCommand) {
		this.logger.debug('execute');

		return await this.entityManager.transaction(async (trx) => {
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

				await this.updateWallet(trx, user.id, data.coinName, saveQuantity);
				await this.createStacking(trx, { ...data, userId: user.id });

				return 'Create Stacking successfully';
			} catch (error) {
				console.log(error);
				throw error;
			}
		});
	}

	private async updateWallet(
		entityManager: EntityManager,
		userId: string,
		coinName: string,
		quantity: number
	) {
		await entityManager
			.createQueryBuilder()
			.update(WalletEntity)
			.set({ quantity: quantity })
			.where({
				userId: userId,
				coinName: coinName
			})
			.execute();
	}

	private async createStacking(
		entityManager: EntityManager,
		stackingData: CreateStackingDtoWithUserId
	) {
		await entityManager.save(StackingEntity, stackingData);
	}
}
