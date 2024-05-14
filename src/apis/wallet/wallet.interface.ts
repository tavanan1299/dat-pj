import { BaseService } from '@common';
import { WalletEntity } from './entities/wallet.entity';

export abstract class IWallet extends BaseService<WalletEntity> {}