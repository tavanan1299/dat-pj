import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { WalletStatus } from '@app/common/enums/wallet.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'pendingWallet' })
export class PendingWalletEntity extends BaseEntity {
	@Column()
	coinName!: string;

	@Column()
	quantity!: number;

	@Column({ nullable: true })
	userId!: string;

	@Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.PENDING })
	status!: WalletStatus;

	@ManyToOne(() => UserEntity, (user) => user.pendingWallets)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;
}
