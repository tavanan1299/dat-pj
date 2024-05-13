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
	frontCitizenID!: string;

	@Column()
	backCitizenID!: string;

	@Column()
	faceID!: string;

	@Column({ nullable: true })
	isVerified!: boolean;

	@OneToOne(() => UserEntity, (user) => user.verify)
	user!: UserEntity;
}
