import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnExpirationTableOtp1714902429210 implements MigrationInterface {
    name = 'AddColumnExpirationTableOtp1714902429210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" ADD "expiresAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "expiresAt"`);
    }

}
