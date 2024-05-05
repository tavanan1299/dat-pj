import { VerifyDto } from '../dto/verify.dto';

export class VerifyCommand {
	data!: VerifyDto;

	constructor(data: VerifyCommand) {
		Object.assign(this, data);
	}
}
