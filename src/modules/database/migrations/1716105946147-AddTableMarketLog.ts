import { MigrationInterface, QueryRunner } from "typeorm";

export class  AddTableMarketLog1716105946147 implements MigrationInterface {
    name = 'AddTableMarketLog1716105946147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "marketLog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" double precision NOT NULL, "currentPrice" double precision NOT NULL, "totalPay" double precision NOT NULL, "userId" uuid, CONSTRAINT "PK_93e725c8ecd978778ef8d8a95a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "marketLog" ADD CONSTRAINT "FK_420de30ede1b3e39c4fcd2e5c47" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketLog" DROP CONSTRAINT "FK_420de30ede1b3e39c4fcd2e5c47"`);
        await queryRunner.query(`DROP TABLE "marketLog"`);
    }

}
