import { MigrationInterface, QueryRunner } from "typeorm";

export class  AddTablePendingWallet1715613526211 implements MigrationInterface {
    name = 'AddTablePendingWallet1715613526211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pendingWallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" integer NOT NULL, "userId" uuid, "status" "public"."pendingWallet_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_019d9f0520fdcc46f181bd55d84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pendingWallet" ADD CONSTRAINT "FK_8041144f6d196c054950ea0f213" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pendingWallet" DROP CONSTRAINT "FK_8041144f6d196c054950ea0f213"`);
        await queryRunner.query(`DROP TABLE "pendingWallet"`);
    }

}
