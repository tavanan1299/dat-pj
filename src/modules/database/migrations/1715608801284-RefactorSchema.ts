import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorSchema1715608801284 implements MigrationInterface {
    name = 'RefactorSchema1715608801284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verifyUser" DROP CONSTRAINT "FK_aea649085eade3360c9e2ca08da"`);
        await queryRunner.query(`ALTER TABLE "verifyUser" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "verifyUser" DROP COLUMN "citizenID"`);
        await queryRunner.query(`ALTER TABLE "verifyUser" ADD "frontCitizenID" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verifyUser" ADD "backCitizenID" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verifyUser" ADD "isVerified" boolean`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verifyId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_579ca429551c77e25261951554f" UNIQUE ("verifyId")`);
        await queryRunner.query(`ALTER TABLE "otp" ALTER COLUMN "isActive" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_579ca429551c77e25261951554f" FOREIGN KEY ("verifyId") REFERENCES "verifyUser"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_579ca429551c77e25261951554f"`);
        await queryRunner.query(`ALTER TABLE "otp" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_579ca429551c77e25261951554f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verifyId"`);
        await queryRunner.query(`ALTER TABLE "verifyUser" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "verifyUser" DROP COLUMN "backCitizenID"`);
        await queryRunner.query(`ALTER TABLE "verifyUser" DROP COLUMN "frontCitizenID"`);
        await queryRunner.query(`ALTER TABLE "verifyUser" ADD "citizenID" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verifyUser" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "verifyUser" ADD CONSTRAINT "FK_aea649085eade3360c9e2ca08da" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
