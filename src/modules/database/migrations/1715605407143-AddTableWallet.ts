import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableWallet1715605407143 implements MigrationInterface {
    name = 'AddTableWallet1715605407143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" integer NOT NULL, "userId" uuid, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stacking" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."stacking_status_enum" AS ENUM('pending', 'approve')`);
        await queryRunner.query(`ALTER TABLE "stacking" ADD "status" "public"."stacking_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "stacking" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."stacking_status_enum"`);
        await queryRunner.query(`ALTER TABLE "stacking" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
