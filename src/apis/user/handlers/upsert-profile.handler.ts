import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as uuid from 'uuid';
import { UpsertProfileCommand } from '../commands/upsert-profile.command';
import { ProfileEntity } from '../entities/profile.entity';
import { UserEntity } from '../entities/user.entity';
import { IUserService } from '../user.interface';

@CommandHandler(UpsertProfileCommand)
export class UpsertHandler implements ICommandHandler<UpsertProfileCommand> {
	private logger = new Logger(UpsertHandler.name);

	constructor(private readonly userService: IUserService) {}

	async execute(command: UpsertProfileCommand) {
		this.logger.debug('execute');
		const { data, user } = command;

		const currentUser = await UserEntity.findOne({
			where: {
				id: user.id
			},
			relations: ['profile']
		});

		const id = uuid.v4();

		const profile = await ProfileEntity.upsert(
			[{ ...data, id: currentUser?.profile?.id ? currentUser?.profile?.id : id }],
			{
				conflictPaths: ['id'],
				skipUpdateIfNoValuesChanged: true
			}
		);

		if (!currentUser?.profile) {
			await UserEntity.save({
				id: user.id,
				profile: profile.identifiers[0].id
			});
		}

		return await UserEntity.findOne({
			where: {
				id: user.id
			},
			relations: ['profile']
		});
	}
}
