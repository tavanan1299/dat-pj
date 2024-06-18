import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameReadDate1717851053339 implements MigrationInterface {
    name = 'ChangeNameReadDate1717851053339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notificationReceive" RENAME COLUMN "read_date" TO "readDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notificationReceive" RENAME COLUMN "readDate" TO "read_date"`);
    }

}
