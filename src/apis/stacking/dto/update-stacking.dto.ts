import { PartialType } from '@nestjs/swagger';
import { CreateStackingDto } from './create-stacking.dto';

export class UpdateStackingDto extends PartialType(CreateStackingDto) {}
