export class GetOneVerifyUserByIdCommand {
	id!: string;

	constructor(data: GetOneVerifyUserByIdCommand) {
		Object.assign(this, data);
	}
}
