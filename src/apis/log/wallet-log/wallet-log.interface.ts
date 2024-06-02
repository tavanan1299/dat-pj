import { BaseService } from '@common';
import { WalletLogEntity } from './entities/wallet-log.entity';

export abstract class IWalletLog extends BaseService<WalletLogEntity> {}
