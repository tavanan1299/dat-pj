import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMarketLogColumn1716730431757 implements MigrationInterface {
    name = 'AddMarketLogColumn1716730431757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketLog" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."marketLog_status_enum" AS ENUM('fail', 'success')`);
        await queryRunner.query(`ALTER TABLE "marketLog" ADD "status" "public"."marketLog_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "marketLog" ADD "desc" character varying`);
        await queryRunner.query(`ALTER TABLE "marketLog" DROP CONSTRAINT "FK_420de30ede1b3e39c4fcd2e5c47"`);
        await queryRunner.query(`ALTER TABLE "marketLog" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "marketLog" ADD CONSTRAINT "FK_420de30ede1b3e39c4fcd2e5c47" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketLog" DROP CONSTRAINT "FK_420de30ede1b3e39c4fcd2e5c47"`);
        await queryRunner.query(`ALTER TABLE "marketLog" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "marketLog" ADD CONSTRAINT "FK_420de30ede1b3e39c4fcd2e5c47" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "marketLog" DROP COLUMN "desc"`);
        await queryRunner.query(`ALTER TABLE "marketLog" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."marketLog_status_enum"`);
        await queryRunner.query(`ALTER TABLE "marketLog" DROP COLUMN "type"`);
    }

}
