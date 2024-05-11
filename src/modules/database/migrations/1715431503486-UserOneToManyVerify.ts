import { MigrationInterface, QueryRunner } from "typeorm";

export class UserOneToManyVerify1715431503486 implements MigrationInterface {
    name = 'UserOneToManyVerify1715431503486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_579ca429551c77e25261951554f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_579ca429551c77e25261951554f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verifyId"`);
        await queryRunner.query(`ALTER TABLE "verifyUser" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "verifyUser" ADD CONSTRAINT "FK_aea649085eade3360c9e2ca08da" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verifyUser" DROP CONSTRAINT "FK_aea649085eade3360c9e2ca08da"`);
        await queryRunner.query(`ALTER TABLE "verifyUser" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verifyId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_579ca429551c77e25261951554f" UNIQUE ("verifyId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_579ca429551c77e25261951554f" FOREIGN KEY ("verifyId") REFERENCES "verifyUser"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
