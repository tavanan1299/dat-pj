import { ErrorType } from '@app/common/enums/errorType.enum';
import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
	constructor() {
		super({ errorType: ErrorType.InvalidToken });
	}
}
