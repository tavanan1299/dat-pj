import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnForFutureCommand1718458678333 implements MigrationInterface {
    name = 'AddColumnForFutureCommand1718458678333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" ADD "isEntry" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "futureCommand" ADD "lessThanEntryPrice" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" DROP COLUMN "lessThanEntryPrice"`);
        await queryRunner.query(`ALTER TABLE "futureCommand" DROP COLUMN "isEntry"`);
    }

}
