import { ApiProperty } from '@nestjs/swagger';
import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	BaseEntity as TypeormBaseEntity,
	UpdateDateColumn
} from 'typeorm';

export class BaseEntity extends TypeormBaseEntity {
	/** uuid */
	@ApiProperty({ description: 'uuid' })
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	/** Ngày tạo */
	@ApiProperty({ description: 'Created at' })
	@CreateDateColumn()
	createdAt!: Date;

	/** Lần cuối update */
	@ApiProperty({ description: 'Updated at' })
	@UpdateDateColumn()
	updatedAt!: Date;

	/** Ngày xoá */
	@ApiProperty({ description: 'Deleted at' })
	@DeleteDateColumn()
	deletedAt?: Date | null;
}
