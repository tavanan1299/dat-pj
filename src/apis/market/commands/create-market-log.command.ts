import { UserEntity } from '@app/apis/user/entities/user.entity';
import { CreateMarketLogDto } from '../dto/create-market-log.dto';

export class CreateMarketLogCommand {
	user!: UserEntity;
	data!: CreateMarketLogDto;

	constructor(data: CreateMarketLogCommand) {
		Object.assign(this, data);
	}
}
