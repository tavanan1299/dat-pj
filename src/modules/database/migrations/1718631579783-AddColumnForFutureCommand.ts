import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnForFutureCommand1718631579783 implements MigrationInterface {
    name = 'AddColumnForFutureCommand1718631579783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."futureCommand_ordertype_enum" AS ENUM('long', 'short')`);
        await queryRunner.query(`ALTER TABLE "futureCommand" ADD "orderType" "public"."futureCommand_ordertype_enum" NOT NULL DEFAULT 'long'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" DROP COLUMN "orderType"`);
        await queryRunner.query(`DROP TYPE "public"."futureCommand_ordertype_enum"`);
    }

}
