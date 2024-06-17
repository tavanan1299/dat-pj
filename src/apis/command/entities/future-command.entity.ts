import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { FutureCommandOrderType, FutureCommandType } from '@app/common/enums/status.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'futureCommand' })
export class FutureCommandEntity extends BaseEntity {
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

	@Column({ default: true })
	isEntry!: boolean;

	@Column({ nullable: true })
	lessThanEntryPrice!: boolean;

	@Column({ type: 'float' })
	leverage!: number;

	@Column({ nullable: true })
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.futureCommands)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;
}
