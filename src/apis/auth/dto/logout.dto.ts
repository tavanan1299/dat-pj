import { PartialType } from '@nestjs/swagger';
import { RefreshTokenRequestDto } from './refresh-token-request.dto';

export class LogoutDto extends PartialType(RefreshTokenRequestDto) {}
