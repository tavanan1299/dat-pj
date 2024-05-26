import { BaseEntity } from '@common';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
const sha1 = require('sha1');

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
