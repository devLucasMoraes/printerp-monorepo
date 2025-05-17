import { MigrationInterface, QueryRunner } from "typeorm";

export class Categoria31747509483379 implements MigrationInterface {
    name = 'Categoria31747509483379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "deleted_by" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "deleted_by" TIMESTAMP`);
    }

}
