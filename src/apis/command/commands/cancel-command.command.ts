export class CancelCommand {
	commandId!: string;

	constructor(data: CancelCommand) {
		Object.assign(this, data);
	}
}
