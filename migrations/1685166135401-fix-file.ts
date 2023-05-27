import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFile1685166135401 implements MigrationInterface {
    name = 'FixFile1685166135401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "file_id_seq" OWNED BY "file"."id"`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "id" SET DEFAULT nextval('"file_id_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "file_id_seq"`);
    }

}
