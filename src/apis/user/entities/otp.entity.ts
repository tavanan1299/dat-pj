import { OTPType } from '@app/common/enums/otpType.enum';
import { BaseEntity } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'otp' })
export class OTPEntity extends BaseEntity {
	@Column()
	otp!: number;

	@Column({ type: 'enum', enum: OTPType, default: OTPType.CONFIRM_ACCOUNT })
	type!: OTPType;

	@ApiProperty({ description: 'Kích hoạt' })
	@Column({ default: true })
	isActive!: boolean;

	@Column({ nullable: true })
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.otps)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;
}
