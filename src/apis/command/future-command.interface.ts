import { BaseService } from "@app/common";
import { EntityManager } from "typeorm";
import { FutureCommandEntity } from "./entities/future-command.entity";

export abstract class IFutureCommand extends BaseService<FutureCommandEntity> {
    abstract handleFutureCommand(trx: EntityManager, command: FutureCommandEntity, price: number): Promise<void>;
    abstract calcProfit(entryPrice: number, outPrice: number, quantity: number, isLong: boolean): number;
}