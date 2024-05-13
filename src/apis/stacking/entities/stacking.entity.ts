import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { StackingStatus } from '@app/common/enums/status.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'stacking' })
export class StackingEntity extends BaseEntity {
	@Column()
	coinName!: string;

	@Column()
	quantity!: number;

	@Column()
	monthSaving!: number;

	@Column({ type: 'enum', enum: StackingStatus, default: StackingStatus.PENDING })
	status!: StackingStatus;

	@Column({ nullable: true })
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.stacks)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;
}
