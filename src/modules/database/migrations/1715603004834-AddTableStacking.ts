import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableStacking1715603004834 implements MigrationInterface {
    name = 'AddTableStacking1715603004834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stacking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" integer NOT NULL, "monthSaving" integer NOT NULL, "status" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_7d5aeb2dbe00e08b5a9a178d659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stacking" ADD CONSTRAINT "FK_05f0f7da2ebc052fc39c10ab558" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stacking" DROP CONSTRAINT "FK_05f0f7da2ebc052fc39c10ab558"`);
        await queryRunner.query(`DROP TABLE "stacking"`);
    }

}
