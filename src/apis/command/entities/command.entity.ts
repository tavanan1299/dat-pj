import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { CommandType } from '@app/common/enums/status.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'command' })
export class CommandEntity extends BaseEntity {
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

	@ManyToOne(() => UserEntity, (user) => user.commands)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;
}
