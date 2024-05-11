import { PartialType } from '@nestjs/swagger';
import { CreateVerifyUserDto } from './create-verify-user.dto';

export class UpdateVerifyUserDto extends PartialType(CreateVerifyUserDto) {}
