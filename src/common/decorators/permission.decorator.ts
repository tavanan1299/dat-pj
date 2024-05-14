import { SetMetadata } from '@nestjs/common';
import { KEY_PERMISSION } from '../constants/constant';

export const AccessPermissions = (action: string) => SetMetadata(KEY_PERMISSION, action);
