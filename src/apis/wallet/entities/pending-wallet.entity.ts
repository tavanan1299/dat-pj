import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { WalletStatus, WalletType } from '@app/common/enums/wallet.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'pendingWallet' })
export class PendingWalletEntity extends BaseEntity {
	@Column()
	coinName!: string;

	@Column()
	quantity!: number;

	@Column()
	proofURL!: string;

	@Column({ nullable: true })
	userId!: string;

	@Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.PENDING })
	status!: WalletStatus;

	@Column({ type: 'enum', enum: WalletType, default: WalletType.DEPOSIT })
	type!: WalletType;

	@ManyToOne(() => UserEntity, (user) => user.pendingWallets)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;
}
