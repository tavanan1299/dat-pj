import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDB1714892034582 implements MigrationInterface {
    name = 'InitDB1714892034582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."otp_type_enum" AS ENUM('confirm_account', 'forgot_password')`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "type" "public"."otp_type_enum" NOT NULL DEFAULT 'confirm_account'`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "otp"`);
        await queryRunner.query(`DROP TYPE "public"."otp_otp_enum"`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "otp" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "otp"`);
        await queryRunner.query(`CREATE TYPE "public"."otp_otp_enum" AS ENUM('confirm_account', 'forgot_password')`);
        await queryRunner.query(`ALTER TABLE "otp" ADD "otp" "public"."otp_otp_enum" NOT NULL DEFAULT 'confirm_account'`);
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
    }

}
