import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1683440408819 implements MigrationInterface {
    name = 'Init1683440408819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."file_audience_type_enum" AS ENUM('ONLY_ME', 'FRIEND', 'PUBLIC')`);
        await queryRunner.query(`CREATE TYPE "public"."file_file_type_enum" AS ENUM('png', 'jpg', 'jpeg', 'pdf', 'mp3', 'mp4', 'wav', 'xlsx', 'xls', 'csv')`);
        await queryRunner.query(`CREATE TABLE "file" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "key" character varying(255) NOT NULL, "bucket" character varying(255) NOT NULL, "size" character varying NOT NULL DEFAULT '0', "audience_type" "public"."file_audience_type_enum" NOT NULL, "file_type" "public"."file_file_type_enum" NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('ACTIVE', 'UNVERIFIED')`);
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" integer NOT NULL, "status" "public"."user_status_enum" NOT NULL, "device_tokens" text array, "phone_number" character varying(50), "address" character varying(255), "email" character varying(255), "name" character varying(50), "birth_date" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_516f1cf15166fd07b732b4b6ab0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_516f1cf15166fd07b732b4b6ab0"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TYPE "public"."file_file_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."file_audience_type_enum"`);
    }

}
