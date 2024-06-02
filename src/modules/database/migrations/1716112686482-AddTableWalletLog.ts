import { MigrationInterface, QueryRunner } from "typeorm";

export class  AddTableWalletLog1716112686482 implements MigrationInterface {
    name = 'AddTableWalletLog1716112686482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "walletLog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "coinName" character varying NOT NULL, "quantity" double precision NOT NULL, "type" character varying NOT NULL, "remainBalance" double precision NOT NULL, "userId" uuid, "walletId" uuid, CONSTRAINT "PK_0dd3aa55100fca7dcbc5359e95f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "walletLog" ADD CONSTRAINT "FK_64d4ba1d58f7b4a16d9305f0d73" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "walletLog" ADD CONSTRAINT "FK_1e2ee21ecead8fc6afdc505d950" FOREIGN KEY ("walletId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "walletLog" DROP CONSTRAINT "FK_1e2ee21ecead8fc6afdc505d950"`);
        await queryRunner.query(`ALTER TABLE "walletLog" DROP CONSTRAINT "FK_64d4ba1d58f7b4a16d9305f0d73"`);
        await queryRunner.query(`DROP TABLE "walletLog"`);
    }

}
