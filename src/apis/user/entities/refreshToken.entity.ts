import { BaseEntity } from '@common';
import * as sha1 from 'sha1';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'refreshToken' })
export class RefreshTokenEntity extends BaseEntity {
	@Column()
	refresh!: string;

	@Column({ nullable: true })
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.rts)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@BeforeInsert()
	async beforeInsert() {
		this.refresh = await sha1(this.refresh);
	}
}
