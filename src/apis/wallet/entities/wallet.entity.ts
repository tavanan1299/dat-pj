import { WalletLogEntity } from '@app/apis/log/wallet-log/entities/wallet-log.entity';
import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'wallet' })
export class WalletEntity extends BaseEntity {
	@Column()
	coinName!: string;

	@Column({ type: 'float' })
	quantity!: number;

	@Column({ nullable: true })
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.wallets)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@OneToMany(() => WalletLogEntity, (walletLog) => walletLog.wallet)
	walletLogs!: WalletLogEntity[];
}
