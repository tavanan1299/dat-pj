import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH } from '../constants/constant';

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
