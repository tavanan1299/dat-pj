import { ErrorType } from '@app/common/enums/errorType.enum';
import { UnauthorizedException } from '@nestjs/common';

export class AccessTokenExpiredException extends UnauthorizedException {
	constructor() {
		super({
			errorType: ErrorType.AccessTokenExpired,
			message: 'Access token has expired'
		});
	}
}
