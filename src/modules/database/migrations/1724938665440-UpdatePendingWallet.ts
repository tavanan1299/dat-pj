import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePendingWallet1724938665440 implements MigrationInterface {
    name = 'UpdatePendingWallet1724938665440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pendingWallet" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "pendingWallet" ADD "quantity" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pendingWallet" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "pendingWallet" ADD "quantity" integer NOT NULL`);
    }

}
