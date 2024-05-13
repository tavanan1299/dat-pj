import { OTPType } from '@app/common/enums/otpType.enum';
import { BaseEntity } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'otp' })
export class OTPEntity extends BaseEntity {
	@Column()
	otp!: number;

	@Column({ type: 'enum', enum: OTPType, default: OTPType.CONFIRM_ACCOUNT })
	type!: OTPType;

	@ApiProperty({ description: 'Active' })
	@Column({ default: false })
	isActive!: boolean;

	@Column({ nullable: true })
	userId!: string;

	@Column({ type: 'timestamp', nullable: true })
	expiresAt!: Date;

	@ManyToOne(() => UserEntity, (user) => user.otps)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@BeforeInsert()
	async beforeInsert() {
		const otpExpirationMinutes = 10;
		const expirationDate = new Date();
		expirationDate.setMinutes(expirationDate.getMinutes() + otpExpirationMinutes);
		this.expiresAt = expirationDate;
	}
}
