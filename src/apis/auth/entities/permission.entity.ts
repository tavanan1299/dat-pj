import { BaseEntity } from '@common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'permission' })
export class PermissionEntity extends BaseEntity {
	@Column()
	permission!: string;

	@Column({ nullable: true })
	roleId!: string;

	@ManyToOne(() => RoleEntity, (role) => role.permissions)
	@JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
	role!: RoleEntity;
}
