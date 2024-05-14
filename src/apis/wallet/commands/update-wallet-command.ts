import { UserEntity } from '@app/apis/user/entities/user.entity';

export class UpdateWalletCommand {
	user!: UserEntity;
	data!: any;

	constructor(data: UpdateWalletCommand) {
		Object.assign(this, data);
	}
}
