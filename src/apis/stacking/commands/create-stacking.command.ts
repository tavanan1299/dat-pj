import { UserEntity } from '@app/apis/user/entities/user.entity';
import { CreateStackingDto } from '../dto/create-stacking.dto';

export class CreateStackingCommand {
	user!: UserEntity;
	data!: CreateStackingDto;

	constructor(data: CreateStackingCommand) {
		Object.assign(this, data);
	}
}
