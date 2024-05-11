import { BaseEntity } from '@common';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'profile' })
export class ProfileEntity extends BaseEntity {
	@Column({ nullable: true })
	avatar!: string;

	@Column({ nullable: true })
	fullname!: string;

	@Column({ nullable: true })
	phone!: string;

	@Column({ nullable: true })
	birthDay!: Date;

	@Column({ nullable: true })
	address!: string;

	@Column({ nullable: true })
	country!: string;

	@OneToOne(() => UserEntity, (user) => user.profile)
	user!: UserEntity;
}
