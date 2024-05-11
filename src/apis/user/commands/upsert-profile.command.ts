import { UpsertProfileDto } from '../dto/upsert-profile.dto';
import { UserEntity } from '../entities/user.entity';

export class UpsertProfileCommand {
	user!: UserEntity;
	data!: UpsertProfileDto;

	constructor(data: UpsertProfileCommand) {
		Object.assign(this, data);
	}
}
