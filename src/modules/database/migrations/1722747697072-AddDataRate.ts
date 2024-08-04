import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataRate1722747697072 implements MigrationInterface {
    name = 'AddDataRate1722747697072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
                BEGIN
                IF NOT EXISTS (SELECT 1 FROM rate) THEN
                    INSERT INTO rate (rate)
                    VALUES ('
                        {
                            "1": 5,
                            "2": 5,
                            "3": 10,
                            "4": 15,
                            "5": 20,
                            "6": 25
                        }
                    ');
                END IF;
            END $$;        
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "rate"`);
    }

}
