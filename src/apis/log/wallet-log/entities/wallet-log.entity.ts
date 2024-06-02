import { UserEntity } from '@app/apis/user/entities/user.entity';
import { WalletEntity } from '@app/apis/wallet/entities/wallet.entity';
import { BaseEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'walletLog' })
export class WalletLogEntity extends BaseEntity {
	@Column()
	coinName!: string;

	@Column({ type: 'float' })
	quantity!: number;

	@Column()
	type!: string;

	@Column({ type: 'float' })
	remainBalance!: number;

	@Column({ nullable: true })
	userId!: string;

	@Column({ nullable: true })
	walletId!: string;

	@ManyToOne(() => UserEntity, (user) => user.wallets)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@ManyToOne(() => WalletEntity, (wallet) => wallet.walletLogs)
	@JoinColumn({ name: 'walletId', referencedColumnName: 'id' })
	wallet!: WalletEntity;
}
