import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColNetworkWallet1716903866710 implements MigrationInterface {
    name = 'AddColNetworkWallet1716903866710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "network" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "network"`);
    }

}
