import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { FutureCommandType } from '@app/common/enums/status.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'futureCommand' })
export class FutureCommandEntity extends BaseEntity {
	@Column()
	coinName!: string;

	@Column({ type: 'float' })
	quantity!: number;

	@Column({ type: 'float' })
	entryPrice!: number;

	@Column()
	marginPercentage!: number;

	@Column({ type: 'float', nullable: true })
	expectPrice!: number;

	@Column({ type: 'float', nullable: true })
	lossStopPrice!: number;

	@Column({ type: 'enum', enum: FutureCommandType })
	type!: FutureCommandType;

	@Column({ type: 'float' })
	liquidationPrice!: number;

	@Column({ type: 'float' })
	leverage!: number;

	@Column({ nullable: true })
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.commands)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;
}
