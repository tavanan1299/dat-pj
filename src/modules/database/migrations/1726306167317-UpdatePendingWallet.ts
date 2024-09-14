import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePendingWallet1726306167317 implements MigrationInterface {
    name = 'UpdatePendingWallet1726306167317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pendingWallet" ADD "wallet_address" character varying`);
        await queryRunner.query(`ALTER TABLE "pendingWallet" ADD "network" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pendingWallet" DROP COLUMN "network"`);
        await queryRunner.query(`ALTER TABLE "pendingWallet" DROP COLUMN "wallet_address"`);
    }

}
