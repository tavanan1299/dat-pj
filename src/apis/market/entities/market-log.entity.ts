import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { MarketLogStatus } from '@app/common/enums/status.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'marketLog' })
export class MarketLogEntity extends BaseEntity {
	@Column()
	coinName!: string;

	@Column({ type: 'float' })
	quantity!: number;

	@Column({ type: 'float' })
	currentPrice!: number;

	@Column({ type: 'float' })
	totalPay!: number;

	@Column()
	type!: string;

	@Column({ type: 'enum', enum: MarketLogStatus })
	status!: MarketLogStatus;

	@Column({ nullable: true })
	desc!: string;

	@Column()
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.marketLogs)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;
}
