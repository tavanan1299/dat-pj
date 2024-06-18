export class CancelMyCommands {
	userId!: string;

	constructor(data: CancelMyCommands) {
		Object.assign(this, data);
	}
}
