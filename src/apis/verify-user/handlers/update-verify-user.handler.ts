import { INotification } from '@app/apis/notification/notification.interface';
import { Notification_Type } from '@app/apis/notification/types';
import { UserEntity } from '@app/apis/user/entities/user.entity';
import { NotificationMessage } from '@app/common/constants/constant';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IVerifyUserService } from '../IVerifyUserService.interface';
import { UpdateVerifyUserCommand } from '../commands/update-verify-user.command';

@CommandHandler(UpdateVerifyUserCommand)
export class UpdateVerifyUserHandler implements ICommandHandler<UpdateVerifyUserCommand> {
	private logger = new Logger(UpdateVerifyUserHandler.name);

	constructor(
		private readonly verifyUserService: IVerifyUserService,
		private readonly notifService: INotification
	) {}

	async execute(command: UpdateVerifyUserCommand) {
		this.logger.debug('execute');
		const { user, data } = command;

		const auth = await UserEntity.findOne({
			where: { id: user.id },
			relations: ['verify']
		});

		if (auth?.verify) {
			if (auth?.verify.isVerified) {
				throw new BadRequestException('Cant not update when admin approved');
			}
			await this.verifyUserService.updateById(auth?.verify.id, { ...data });
		} else {
			await this.verifyUserService.create({ ...data, user });
		}

		const DATA_NOTI: Notification_Type = {
			message: NotificationMessage.KYC,
			entity: 'notification',
			entityKind: 'create',
			notiType: 'announcement'
		};

		await this.notifService.sendNotification(DATA_NOTI, user.id, {
			body: `Kyc is being approved`,
			action: 'kyc'
		});

		return 'Update verify user successfully';
	}
}
