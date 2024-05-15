import { UserEntity } from '@app/apis/user/entities/user.entity';

export class WithdrawWalletCommand {
	user!: UserEntity;
	data!: any;

	constructor(data: WithdrawWalletCommand) {
		Object.assign(this, data);
	}
}
