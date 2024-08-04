import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import {
	CommonStatus,
	FutureCommandOrderType,
	FutureCommandType
} from '@app/common/enums/status.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'futureCommandLog' })
export class FutureCommandLogEntity extends BaseEntity {
	@Column()
	coinName!: string;

	@Column({ type: 'float' })
	quantity!: number;

	@Column({ type: 'float' })
	entryPrice!: number;

	@Column({ type: 'float', nullable: true })
	expectPrice!: number;

	@Column({ type: 'float', nullable: true })
	lossStopPrice!: number;

	@Column({ type: 'enum', enum: FutureCommandType })
	type!: FutureCommandType;

	@Column({ type: 'enum', enum: FutureCommandOrderType, default: FutureCommandOrderType.LONG })
	orderType!: FutureCommandOrderType;

	@Column({ type: 'float' })
	leverage!: number;

	@Column({ type: 'float', nullable: true })
	PNLClosed!: number;

	@Column({ type: 'float', nullable: true })
	closedVolume!: number;

	@Column({ type: 'float', nullable: true })
	closingPrice!: number;

	@Column({ type: 'date', nullable: true })
	closedAt?: Date | null;

	@Column({ nullable: true })
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.futureCommandLogs)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@Column({ type: 'enum', enum: CommonStatus })
	status!: CommonStatus;

	@Column({ nullable: true })
	desc!: string;
}
