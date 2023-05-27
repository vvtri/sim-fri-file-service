import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1683682313385 implements MigrationInterface {
    name = 'UpdateUser1683682313385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "device_tokens"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birth_date"`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "file_id_seq"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "file_id_seq" OWNED BY "file"."id"`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "id" SET DEFAULT nextval('"file_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "birth_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "device_tokens" text array`);
    }

}
