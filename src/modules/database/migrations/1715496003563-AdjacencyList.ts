import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjacencyList1715496003563 implements MigrationInterface {
    name = 'AdjacencyList1715496003563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "inviteCode" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_327b3d13907d1e1dbdd69587436" UNIQUE ("inviteCode")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_327b3d13907d1e1dbdd69587436" FOREIGN KEY ("inviteCode") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_327b3d13907d1e1dbdd69587436"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_327b3d13907d1e1dbdd69587436"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "inviteCode"`);
    }

}
