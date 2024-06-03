import { BaseService } from '@common';
import { EntityManager } from 'typeorm';
import { WalletEntity } from './entities/wallet.entity';

export abstract class IWallet extends BaseService<WalletEntity> {
    abstract decrease(trx: EntityManager, coinName: string, coinQuantity: number, userId: string): Promise<void>;
    abstract increase(trx: EntityManager, coinName: string, coinQuantity: number, userId: string): Promise<void>;
}