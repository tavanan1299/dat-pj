import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFcmTokenTableUser1717589118787 implements MigrationInterface {
    name = 'AddFcmTokenTableUser1717589118787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fcmToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_69bca4feec8296f76d099aad042" UNIQUE ("fcmToken")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_69bca4feec8296f76d099aad042"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fcmToken"`);
    }

}
