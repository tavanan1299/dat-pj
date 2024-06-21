import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableFutureCommand1718377094025 implements MigrationInterface {
    name = 'AddTableFutureCommand1718377094025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."futureCommand_type_enum" AS ENUM('limit', 'market')`);
        await queryRunner.query(`CREATE TABLE "futureCommand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" double precision NOT NULL, "entryPrice" double precision NOT NULL, "marginPercentage" integer NOT NULL, "expectPrice" double precision, "lossStopPrice" double precision, "type" "public"."futureCommand_type_enum" NOT NULL, "liquidationPrice" double precision NOT NULL, "leverage" double precision NOT NULL, "userId" uuid, CONSTRAINT "PK_a98db09402a0003cf68568cd236" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "futureCommand" ADD CONSTRAINT "FK_52659a84ac34fcb72d27c2e7a39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" DROP CONSTRAINT "FK_52659a84ac34fcb72d27c2e7a39"`);
        await queryRunner.query(`DROP TABLE "futureCommand"`);
        await queryRunner.query(`DROP TYPE "public"."futureCommand_type_enum"`);
    }

}
