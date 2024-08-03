import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFutureHistories1722691075017 implements MigrationInterface {
    name = 'UpdateFutureHistories1722691075017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommandLog" ADD "PNLClosed" double precision`);
        await queryRunner.query(`ALTER TABLE "futureCommandLog" ADD "closedVolume" double precision`);
        await queryRunner.query(`ALTER TABLE "futureCommandLog" ADD "closingPrice" double precision`);
        await queryRunner.query(`ALTER TABLE "futureCommandLog" ADD "closedAt" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommandLog" DROP COLUMN "closedAt"`);
        await queryRunner.query(`ALTER TABLE "futureCommandLog" DROP COLUMN "closingPrice"`);
        await queryRunner.query(`ALTER TABLE "futureCommandLog" DROP COLUMN "closedVolume"`);
        await queryRunner.query(`ALTER TABLE "futureCommandLog" DROP COLUMN "PNLClosed"`);
    }

}
