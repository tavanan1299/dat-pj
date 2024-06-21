import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorFutureCommand1718531224550 implements MigrationInterface {
    name = 'RefactorFutureCommand1718531224550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" DROP COLUMN "marginPercentage"`);
        await queryRunner.query(`ALTER TABLE "futureCommand" DROP COLUMN "liquidationPrice"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "futureCommand" ADD "liquidationPrice" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "futureCommand" ADD "marginPercentage" integer NOT NULL`);
    }

}
