import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPendingWallet1723886092733 implements MigrationInterface {
    name = 'FixPendingWallet1723886092733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pendingWallet" ADD "proofURL" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pendingWallet" DROP COLUMN "proofURL"`);
    }

}
