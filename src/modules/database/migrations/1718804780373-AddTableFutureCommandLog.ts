import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableFutureCommandLog1718804780373 implements MigrationInterface {
    name = 'AddTableFutureCommandLog1718804780373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."futureCommandLog_type_enum" AS ENUM('limit', 'market')`);
        await queryRunner.query(`CREATE TYPE "public"."futureCommandLog_ordertype_enum" AS ENUM('long', 'short')`);
        await queryRunner.query(`CREATE TYPE "public"."futureCommandLog_status_enum" AS ENUM('fail', 'success')`);
        await queryRunner.query(`CREATE TABLE "futureCommandLog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" double precision NOT NULL, "entryPrice" double precision NOT NULL, "expectPrice" double precision, "lossStopPrice" double precision, "type" "public"."futureCommandLog_type_enum" NOT NULL, "orderType" "public"."futureCommandLog_ordertype_enum" NOT NULL DEFAULT 'long', "leverage" double precision NOT NULL, "userId" uuid, "status" "public"."futureCommandLog_status_enum" NOT NULL, "desc" character varying, CONSTRAINT "PK_978aff308795ed3b2c3cdc7ea19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "futureCommandLog" ADD CONSTRAINT "FK_551c28d548a5c4d97c817ea446d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommandLog" DROP CONSTRAINT "FK_551c28d548a5c4d97c817ea446d"`);
        await queryRunner.query(`DROP TABLE "futureCommandLog"`);
        await queryRunner.query(`DROP TYPE "public"."futureCommandLog_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."futureCommandLog_ordertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."futureCommandLog_type_enum"`);
    }

}
