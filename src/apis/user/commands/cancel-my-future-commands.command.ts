export class CancelMyFutureCommands {
	userId!: string;

	constructor(data: CancelMyFutureCommands) {
		Object.assign(this, data);
	}
}
