import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'verifyUser' })
export class VerifyUserEntity extends BaseEntity {
	@Column()
	dateOfBirth!: Date;

	@Column()
	address!: string;

	@Column()
	citizenID!: string;

	@Column()
	faceID!: string;

	@Column({ nullable: true })
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.verify)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;
}
