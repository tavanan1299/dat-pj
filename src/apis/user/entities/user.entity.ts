import { VerifyUserEntity } from '@app/apis/verify-user/entities/verify-user.entity';
import { BaseEntity } from '@common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { hash } from 'argon2';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { OTPEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';
import { RefreshTokenEntity } from './refreshToken.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
	@Column()
	email!: string;

	@ApiHideProperty()
	@Column()
	@Exclude()
	password!: string;

	@ApiProperty({ description: 'Active' })
	@Column({ default: false })
	isActive!: boolean;

	@OneToMany(() => OTPEntity, (otp) => otp.user)
	otps!: OTPEntity[];

	@OneToMany(() => RefreshTokenEntity, (rt) => rt.user)
	rts!: RefreshTokenEntity[];

	@OneToOne(() => ProfileEntity, (profile) => profile.user)
	@JoinColumn()
	profile!: ProfileEntity;

	@OneToMany(() => VerifyUserEntity, (verify) => verify.user)
	verify!: VerifyUserEntity;

	@BeforeInsert()
	async beforeInsert() {
		this.password = await hash(this.password);
	}
}
