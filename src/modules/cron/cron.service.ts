import { INotification } from '@app/apis/notification/notification.interface';
import { Notification_Type } from '@app/apis/notification/types';
import { RateEntity } from '@app/apis/stacking/entities/rate.entity';
import { StackingEntity } from '@app/apis/stacking/entities/stacking.entity';
import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { IWallet } from '@app/apis/wallet/wallet.interface';
import { HistoryWalletType } from '@app/common/constants/constant';
import { StackingStatus } from '@app/common/enums/status.enum';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { differenceInCalendarMonths } from 'date-fns';
import { EntityManager } from 'typeorm';
import { ICronService } from './cron.interface';

@Injectable()
export class CronService extends ICronService {
	private readonly logger = new Logger(CronService.name);

	constructor(
		private readonly notifService: INotification,
		private readonly walletService: IWallet,
		private readonly entityManager: EntityManager
	) {
		super();
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async handleStacking() {
		this.logger.debug('cronnnnnnnnnnnnn');

		const stackings = await StackingEntity.find({
			where: {
				status: StackingStatus.PENDING
			}
		});
		const rate = await RateEntity.find();
		const INTEREST_RATE = rate[0].rate;

		const currentDate = new Date();

		for (const stacking of stackings) {
			const createdAt = new Date(stacking.createdAt);
			const monthDiff = differenceInCalendarMonths(currentDate, createdAt);
			if (monthDiff === stacking.monthSaving) {
				const wallet = await WalletEntity.findOne({
					where: {
						userId: stacking.userId,
						coinName: stacking.coinName
					}
				});
				if (wallet) {
					const rate = (INTEREST_RATE[stacking.monthSaving] as number) || 0;
					const profit = (stacking.quantity * rate) / 100 + stacking.quantity;

					await this.walletService.increase(
						this.entityManager,
						stacking.coinName,
						profit,
						stacking.userId,
						HistoryWalletType.STACKING
					);

					const DATA_NOTI: Notification_Type = {
						message: 'Stacking done',
						entity: 'notification',
						entityKind: 'create',
						notiType: 'announcement'
					};

					await this.notifService.sendNotification(DATA_NOTI, wallet.userId, {
						body: 'Stacking is done',
						...stacking,
						status: StackingStatus.DONE,
						action: 'stacking'
					});

					stacking.status = StackingStatus.DONE;
					await StackingEntity.update(stacking.id, { status: stacking.status });
				}
			}
		}
	}
}
