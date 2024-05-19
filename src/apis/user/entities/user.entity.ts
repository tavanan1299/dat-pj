import { RoleEntity } from '@app/apis/auth/entities/role.entity';
import { MarketLogEntity } from '@app/apis/market/entities/market-log.entity';
import { StackingEntity } from '@app/apis/stacking/entities/stacking.entity';
import { VerifyUserEntity } from '@app/apis/verify-user/entities/verify-user.entity';
import { PendingWalletEntity } from '@app/apis/wallet/entities/pending-wallet.entity';
import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { BaseEntity } from '@common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { hash } from 'argon2';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
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

	@OneToMany(() => StackingEntity, (stack) => stack.user)
	stacks!: StackingEntity[];

	@OneToMany(() => PendingWalletEntity, (pendingWallet) => pendingWallet.user)
	pendingWallets!: PendingWalletEntity[];

	@OneToMany(() => WalletEntity, (wallet) => wallet.user)
	wallets!: WalletEntity[];

	@OneToMany(() => MarketLogEntity, (marketLog) => marketLog.user)
	marketLogs!: MarketLogEntity[];

	@OneToMany(() => RefreshTokenEntity, (rt) => rt.user)
	rts!: RefreshTokenEntity[];

	@OneToOne(() => ProfileEntity, (profile) => profile.user)
	@JoinColumn()
	profile!: ProfileEntity;

	@OneToOne(() => VerifyUserEntity, (verify) => verify.user)
	@JoinColumn()
	verify!: VerifyUserEntity;

	@Column({ nullable: true, unique: true })
	inviteCode!: string;

	@Column({ nullable: true })
	userId!: string;

	@Column()
	roleId!: string;

	@ManyToOne(() => UserEntity, (user) => user.children, { nullable: true })
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	parent!: UserEntity;

	@OneToMany(() => UserEntity, (user) => user.parent, { nullable: true })
	children!: UserEntity[];

	@ManyToOne(() => RoleEntity, (role) => role.users)
	@JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
	role!: RoleEntity;

	@BeforeInsert()
	async beforeInsert() {
		this.password = await hash(this.password);
	}
}
