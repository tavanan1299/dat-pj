import { BaseEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'rate' })
export class RateEntity extends BaseEntity {
	@Column('jsonb')
	rate!: Record<string, unknown>;
}
