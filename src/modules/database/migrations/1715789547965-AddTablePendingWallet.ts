import { MigrationInterface, QueryRunner } from "typeorm";

export class  AddTablePendingWallet1715789547965 implements MigrationInterface {
    name = 'AddTablePendingWallet1715789547965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pendingWallet_status_enum" AS ENUM('pending', 'approve')`);
        await queryRunner.query(`CREATE TYPE "public"."pendingWallet_type_enum" AS ENUM('deposit', 'withdraw')`);
        await queryRunner.query(`CREATE TABLE "pendingWallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" integer NOT NULL, "userId" uuid, "status" "public"."pendingWallet_status_enum" NOT NULL DEFAULT 'pending', "type" "public"."pendingWallet_type_enum" NOT NULL DEFAULT 'deposit', CONSTRAINT "PK_019d9f0520fdcc46f181bd55d84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pendingWallet" ADD CONSTRAINT "FK_8041144f6d196c054950ea0f213" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pendingWallet" DROP CONSTRAINT "FK_8041144f6d196c054950ea0f213"`);
        await queryRunner.query(`DROP TABLE "pendingWallet"`);
        await queryRunner.query(`DROP TYPE "public"."pendingWallet_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pendingWallet_status_enum"`);
    }

}
