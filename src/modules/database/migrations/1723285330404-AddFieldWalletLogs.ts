import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldWalletLogs1723285330404 implements MigrationInterface {
    name = 'AddFieldWalletLogs1723285330404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."walletLog_status_enum" AS ENUM('fail', 'success')`);
        await queryRunner.query(`ALTER TABLE "walletLog" ADD "status" "public"."walletLog_status_enum" NOT NULL DEFAULT 'success'`);
        await queryRunner.query(`ALTER TABLE "walletLog" ADD "desc" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "walletLog" DROP COLUMN "desc"`);
        await queryRunner.query(`ALTER TABLE "walletLog" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."walletLog_status_enum"`);
    }

}
