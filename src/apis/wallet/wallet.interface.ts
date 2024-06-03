import { BaseService } from '@common';
import { WalletEntity } from './entities/wallet.entity';

export abstract class IWallet extends BaseService<WalletEntity> {
    abstract decrease(coinName: string, coinQuantity: number, userId: string): Promise<void>;
    abstract increase(coinName: string, coinQuantity: number, userId: string): Promise<void>;
}