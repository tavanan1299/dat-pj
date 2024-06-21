import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiquidationPrice801718978846197 implements MigrationInterface {
    name = 'AddLiquidationPrice801718978846197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" ADD "liquidationPrice80" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" DROP COLUMN "liquidationPrice80"`);
    }

}
