import { BaseEntity } from '@common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { hash } from 'argon2';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { OTPEntity } from './otp.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
	@Column({ nullable: true })
	username!: string;

	@Column()
	email!: string;

	@ApiHideProperty()
	@Column()
	@Exclude()
	password!: string;

	@ApiProperty({ description: 'Kích hoạt' })
	@Column({ default: false })
	isActive!: boolean;

	@OneToMany(() => OTPEntity, (otp) => otp.user)
	otps!: OTPEntity[];

	@BeforeInsert()
	async beforeInsert() {
		this.password = await hash(this.password);
	}
}
