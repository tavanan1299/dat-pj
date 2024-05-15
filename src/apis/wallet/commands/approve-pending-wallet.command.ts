export class ApprovePendingWalletCommand {
	id!: string;

	constructor(data: ApprovePendingWalletCommand) {
		Object.assign(this, data);
	}
}
