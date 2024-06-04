import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { CommandType, CommonStatus } from '@app/common/enums/status.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'commandLog' })
export class CommandLogEntity extends BaseEntity {
	@Column()
	coinName!: string;

	@Column({ type: 'float' })
	quantity!: number;

	@Column({ type: 'float' })
	totalPay!: number;

	@Column({ type: 'float' })
	expectPrice!: number;

	@Column({ type: 'float', nullable: true })
	lossStopPrice!: number;

	@Column({ type: 'enum', enum: CommandType })
	type!: CommandType;

	@Column({ nullable: true })
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.commandLogs)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@Column({ type: 'enum', enum: CommonStatus })
	status!: CommonStatus;

	@Column({ nullable: true })
	desc!: string;

	@Column({ default: false })
	isLostStop!: boolean;
}
