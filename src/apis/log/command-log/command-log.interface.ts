import { BaseService } from '@common';
import { CommandLogEntity } from './entities/command-log.entity';

export abstract class ICommandLog extends BaseService<CommandLogEntity> {}
