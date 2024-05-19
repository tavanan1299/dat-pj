import { MigrationInterface, QueryRunner } from "typeorm";

export class  ChangeJoinColumnWalletLog1716116127860 implements MigrationInterface {
    name = 'ChangeJoinColumnWalletLog1716116127860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "walletLog" DROP CONSTRAINT "FK_1e2ee21ecead8fc6afdc505d950"`);
        await queryRunner.query(`ALTER TABLE "walletLog" ADD CONSTRAINT "FK_1e2ee21ecead8fc6afdc505d950" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "walletLog" DROP CONSTRAINT "FK_1e2ee21ecead8fc6afdc505d950"`);
        await queryRunner.query(`ALTER TABLE "walletLog" ADD CONSTRAINT "FK_1e2ee21ecead8fc6afdc505d950" FOREIGN KEY ("walletId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
