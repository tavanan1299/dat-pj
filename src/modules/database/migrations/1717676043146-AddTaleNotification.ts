import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaleNotification1717676043146 implements MigrationInterface {
    name = 'AddTaleNotification1717676043146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "message" character varying, "entity" character varying NOT NULL DEFAULT 'transaction', "entityKind" character varying NOT NULL DEFAULT 'create', "notiType" character varying NOT NULL DEFAULT 'announcement', CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notificationReceive" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "metaData" jsonb, "isRead" boolean NOT NULL DEFAULT false, "read_date" TIMESTAMP, "userId" uuid, "notificationReceiveId" uuid, CONSTRAINT "PK_da99b7918e5a46c88a4910b6b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notificationReceive" ADD CONSTRAINT "FK_a17f392980987c755e0d354cc61" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notificationReceive" ADD CONSTRAINT "FK_8fd403ddd7d6d92b1260660b694" FOREIGN KEY ("notificationReceiveId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notificationReceive" DROP CONSTRAINT "FK_8fd403ddd7d6d92b1260660b694"`);
        await queryRunner.query(`ALTER TABLE "notificationReceive" DROP CONSTRAINT "FK_a17f392980987c755e0d354cc61"`);
        await queryRunner.query(`DROP TABLE "notificationReceive"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
