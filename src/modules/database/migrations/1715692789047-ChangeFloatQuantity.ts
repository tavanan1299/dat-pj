import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFloatQuantity1715692789047 implements MigrationInterface {
    name = 'ChangeFloatQuantity1715692789047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stacking" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "stacking" ADD "quantity" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "quantity" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stacking" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "stacking" ADD "quantity" integer NOT NULL`);
    }

}
