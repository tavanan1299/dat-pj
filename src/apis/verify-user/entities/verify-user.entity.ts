import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@common';
import { Column, Entity, OneToOne } from 'typeorm';

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

	@OneToOne(() => UserEntity, (user) => user.verify)
	user!: UserEntity;
}
