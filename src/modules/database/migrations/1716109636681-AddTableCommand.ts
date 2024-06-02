import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCommand1716109636681 implements MigrationInterface {
    name = 'AddTableCommand1716109636681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."command_type_enum" AS ENUM('buy', 'sell')`);
        await queryRunner.query(`CREATE TABLE "command" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" double precision NOT NULL, "totalPay" double precision NOT NULL, "expectPrice" double precision NOT NULL, "lossStopPrice" double precision, "type" "public"."command_type_enum" NOT NULL, "userId" uuid, CONSTRAINT "PK_5bfa4e1cb54b62f512078f3e7cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "command" ADD CONSTRAINT "FK_64e59b6d6cbc5a7a591a2539e3f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "command" DROP CONSTRAINT "FK_64e59b6d6cbc5a7a591a2539e3f"`);
        await queryRunner.query(`DROP TABLE "command"`);
        await queryRunner.query(`DROP TYPE "public"."command_type_enum"`);
    }

}
