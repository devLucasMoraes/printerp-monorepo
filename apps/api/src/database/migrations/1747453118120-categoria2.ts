import { MigrationInterface, QueryRunner } from "typeorm";

export class Categoria21747453118120 implements MigrationInterface {
    name = 'Categoria21747453118120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categorias" DROP CONSTRAINT "UQ_de8a2d8979f7820616e31dc1e15"`);
        await queryRunner.query(`CREATE INDEX "IDX_MEMBER_ORGANIZATION" ON "members" ("organization_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_MEMBER_USER" ON "members" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ORGANIZATION_SLUG" ON "organizations" ("slug") `);
        await queryRunner.query(`ALTER TABLE "categorias" ADD CONSTRAINT "UQ_6441422372f9a3bdd1145dece14" UNIQUE ("nome", "organization_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categorias" DROP CONSTRAINT "UQ_6441422372f9a3bdd1145dece14"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ORGANIZATION_SLUG"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_USER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_ORGANIZATION"`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD CONSTRAINT "UQ_de8a2d8979f7820616e31dc1e15" UNIQUE ("nome")`);
    }

}
