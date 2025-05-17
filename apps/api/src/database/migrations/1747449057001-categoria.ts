import { MigrationInterface, QueryRunner } from "typeorm";

export class Categoria1747449057001 implements MigrationInterface {
    name = 'Categoria1747449057001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "created_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "updated_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "deleted_by" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "organization_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "insumos" DROP CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da"`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP CONSTRAINT "PK_3886a26251605c571c6b4f861fe"`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "insumos" DROP COLUMN "categoria_id"`);
        await queryRunner.query(`ALTER TABLE "insumos" ADD "categoria_id" uuid`);
        await queryRunner.query(`ALTER TABLE "insumos" ADD CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumos" DROP CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da"`);
        await queryRunner.query(`ALTER TABLE "insumos" DROP COLUMN "categoria_id"`);
        await queryRunner.query(`ALTER TABLE "insumos" ADD "categoria_id" integer`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP CONSTRAINT "PK_3886a26251605c571c6b4f861fe"`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "insumos" ADD CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "organization_id"`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "user_id" character varying(255) NOT NULL`);
    }

}
