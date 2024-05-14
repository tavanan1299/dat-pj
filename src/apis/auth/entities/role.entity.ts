import { UserEntity } from '@app/apis/user/entities/user.entity';
import { BaseEntity } from '@common';
import { Column, Entity, OneToMany } from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity({ name: 'role' })
export class RoleEntity extends BaseEntity {
	@Column()
	name!: string;

	@OneToMany(() => PermissionEntity, (permission) => permission.role)
	permissions!: PermissionEntity[];

	@OneToMany(() => UserEntity, (user) => user.role)
	users!: UserEntity[];
}
