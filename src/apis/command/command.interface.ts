import { BaseService } from "@app/common";
import { CommandEntity } from "./entities/command.entity";

export abstract class ICommand extends BaseService<CommandEntity> {}