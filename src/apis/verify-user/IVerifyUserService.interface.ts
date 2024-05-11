import { BaseService } from '@common';
import { VerifyUserEntity } from './entities/verify-user.entity';

export abstract class IVerifyUserService extends BaseService<VerifyUserEntity> {}
