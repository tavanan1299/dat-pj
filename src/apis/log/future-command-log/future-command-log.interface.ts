import { BaseService } from '@common';
import { FutureCommandLogEntity } from './entities/future-command-log.entity';

export abstract class IFutureCommandLog extends BaseService<FutureCommandLogEntity> {}
