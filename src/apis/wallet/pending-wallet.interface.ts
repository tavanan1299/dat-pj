import { BaseService } from '@common';
import { PendingWalletEntity } from './entities/pending-wallet.entity';

export abstract class IPendingWallet extends BaseService<PendingWalletEntity> {}