import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCommandLog1717427348416 implements MigrationInterface {
    name = 'AddTableCommandLog1717427348416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."commandLog_type_enum" AS ENUM('buy', 'sell')`);
        await queryRunner.query(`CREATE TYPE "public"."commandLog_status_enum" AS ENUM('fail', 'success')`);
        await queryRunner.query(`CREATE TABLE "commandLog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" double precision NOT NULL, "totalPay" double precision NOT NULL, "expectPrice" double precision NOT NULL, "lossStopPrice" double precision, "type" "public"."commandLog_type_enum" NOT NULL, "userId" uuid, "status" "public"."commandLog_status_enum" NOT NULL, "desc" character varying, "isLostStop" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_899121f52f9396583f4c228e11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "commandLog" ADD CONSTRAINT "FK_68644cafe23052be2f65e218b0f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commandLog" DROP CONSTRAINT "FK_68644cafe23052be2f65e218b0f"`);
        await queryRunner.query(`DROP TABLE "commandLog"`);
        await queryRunner.query(`DROP TYPE "public"."commandLog_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."commandLog_type_enum"`);
    }

}
