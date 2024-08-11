import { INotification } from '@app/apis/notification/notification.interface';
import { Notification_Type } from '@app/apis/notification/types';
import { NotificationMessage } from '@app/common/constants/constant';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IVerifyUserService } from '../IVerifyUserService.interface';
import { ApproveVerifyUserCommand } from '../commands/approve-verify-user.command';

@CommandHandler(ApproveVerifyUserCommand)
export class ApproveVerifyUserHandler implements ICommandHandler<ApproveVerifyUserCommand> {
	private logger = new Logger(ApproveVerifyUserHandler.name);

	constructor(
		private readonly verifyUserService: IVerifyUserService,
		private readonly notifService: INotification
	) {}

	async execute(command: ApproveVerifyUserCommand) {
		this.logger.log(command);
		const { id } = command;
		const verifyUser = await this.verifyUserService.getOneByIdOrFail(id, {
			relations: ['user']
		});

		await this.verifyUserService.updateById(id, { isVerified: true });

		const DATA_NOTI: Notification_Type = {
			message: NotificationMessage.KYC,
			entity: 'notification',
			entityKind: 'create',
			notiType: 'announcement'
		};

		await this.notifService.sendNotification(DATA_NOTI, verifyUser.user.id, {
			body: `Kyc have been approved`,
			action: 'kyc'
		});

		return 'Approved verify user success';
	}
}
