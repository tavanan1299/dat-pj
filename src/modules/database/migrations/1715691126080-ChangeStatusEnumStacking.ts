import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeStatusEnumStacking1715691126080 implements MigrationInterface {
    name = 'ChangeStatusEnumStacking1715691126080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."stacking_status_enum" RENAME TO "stacking_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."stacking_status_enum" AS ENUM('pending', 'done')`);
        await queryRunner.query(`ALTER TABLE "stacking" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stacking" ALTER COLUMN "status" TYPE "public"."stacking_status_enum" USING "status"::"text"::"public"."stacking_status_enum"`);
        await queryRunner.query(`ALTER TABLE "stacking" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."stacking_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."stacking_status_enum_old" AS ENUM('pending', 'approve')`);
        await queryRunner.query(`ALTER TABLE "stacking" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stacking" ALTER COLUMN "status" TYPE "public"."stacking_status_enum_old" USING "status"::"text"::"public"."stacking_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "stacking" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."stacking_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."stacking_status_enum_old" RENAME TO "stacking_status_enum"`);
    }

}
