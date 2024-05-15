import { MigrationInterface, QueryRunner } from "typeorm";

export class  AddTypeEnumPendingWallet1715779683306 implements MigrationInterface {
    name = 'AddTypeEnumPendingWallet1715779683306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pendingWallet_type_enum" AS ENUM('deposit', 'withdraw')`);
        await queryRunner.query(`ALTER TABLE "pendingWallet" ADD "type" "public"."pendingWallet_type_enum" NOT NULL DEFAULT 'deposit'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pendingWallet" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."pendingWallet_type_enum"`);
    }

}
