import { WalletLogEntity } from '@app/apis/log/wallet-log/entities/wallet-log.entity';
import { StackingEntity } from '@app/apis/stacking/entities/stacking.entity';
import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { INTEREST_RATE } from '@app/common/constants/constant';
import { StackingStatus } from '@app/common/enums/status.enum';
import { WalletLogType } from '@app/common/enums/walletLog.enum';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { differenceInCalendarMonths } from 'date-fns';
import { ICronService } from './cron.interface';

@Injectable()
export class CronService extends ICronService {
	private readonly logger = new Logger(CronService.name);

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async handleStacking() {
		this.logger.debug('cronnnnnnnnnnnnn');

		const stackings = await StackingEntity.find({
			where: {
				status: StackingStatus.PENDING
			}
		});
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
					const rate = INTEREST_RATE[wallet.quantity] || 0;
					const profit = (wallet.quantity * rate) / 100;
					wallet.quantity += profit;
					await WalletEntity.update(wallet.id, { quantity: wallet.quantity });

					await WalletLogEntity.save(
						WalletLogEntity.create({
							userId: wallet.userId,
							walletId: wallet.id,
							coinName: wallet.coinName,
							quantity: profit,
							remainBalance: +wallet.quantity,
							type: WalletLogType.STACKING
						})
					);

					stacking.status = StackingStatus.DONE;
					await StackingEntity.update(stacking.id, { status: stacking.status });
				}
			}
		}
	}
}
