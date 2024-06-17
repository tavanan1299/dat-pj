import { BaseService } from "@app/common";
import { EntityManager } from "typeorm";
import { FutureCommandEntity } from "./entities/future-command.entity";

export abstract class IFutureCommand extends BaseService<FutureCommandEntity> {
    abstract handleFutureCommand(trx: EntityManager, command: FutureCommandEntity, price: number): Promise<void>;
    abstract calcAmount(bigPrice: number,
		smallPrice: number,
		quantity: number,
		leverage: number,
		isLose: boolean): number;
}