import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdRelationAdjacency1715497999742 implements MigrationInterface {
    name = 'AddUserIdRelationAdjacency1715497999742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_d72ea127f30e21753c9e229891e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_d72ea127f30e21753c9e229891e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_cace4a159ff9f2512dd42373760" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
