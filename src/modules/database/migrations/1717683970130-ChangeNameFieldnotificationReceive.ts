import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameFieldnotificationReceive1717683970130 implements MigrationInterface {
    name = 'ChangeNameFieldnotificationReceive1717683970130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notificationReceive" DROP CONSTRAINT "FK_8fd403ddd7d6d92b1260660b694"`);
        await queryRunner.query(`ALTER TABLE "notificationReceive" RENAME COLUMN "notificationReceiveId" TO "notificationId"`);
        await queryRunner.query(`ALTER TABLE "notificationReceive" ADD CONSTRAINT "FK_946f3ba74732726b9077bca3051" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notificationReceive" DROP CONSTRAINT "FK_946f3ba74732726b9077bca3051"`);
        await queryRunner.query(`ALTER TABLE "notificationReceive" RENAME COLUMN "notificationId" TO "notificationReceiveId"`);
        await queryRunner.query(`ALTER TABLE "notificationReceive" ADD CONSTRAINT "FK_8fd403ddd7d6d92b1260660b694" FOREIGN KEY ("notificationReceiveId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
