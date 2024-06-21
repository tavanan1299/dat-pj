import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiquidationPrice1718903675974 implements MigrationInterface {
    name = 'AddLiquidationPrice1718903675974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" ADD "liquidationPrice" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" DROP COLUMN "liquidationPrice"`);
    }

}
