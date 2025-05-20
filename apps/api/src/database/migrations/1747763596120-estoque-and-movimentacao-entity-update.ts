import { MigrationInterface, QueryRunner } from "typeorm";

export class EstoqueAndMovimentacaoEntityUpdate1747763596120 implements MigrationInterface {
    name = 'EstoqueAndMovimentacaoEntityUpdate1747763596120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "regularizado"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "documento_origem"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "created_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "updated_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "organization_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "documento_origem_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "created_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "updated_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "organization_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "PK_f0167ad29177850a7c4dc6d4606"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "PK_f0167ad29177850a7c4dc6d4606" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP CONSTRAINT "PK_049cbdf51633449b22f020680d1"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD CONSTRAINT "PK_049cbdf51633449b22f020680d1" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "estoques" DROP CONSTRAINT "PK_049cbdf51633449b22f020680d1"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD CONSTRAINT "PK_049cbdf51633449b22f020680d1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "PK_f0167ad29177850a7c4dc6d4606"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "PK_f0167ad29177850a7c4dc6d4606" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "organization_id"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "documento_origem_id"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "organization_id"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "user_id" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "documento_origem" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "regularizado" boolean NOT NULL DEFAULT false`);
    }

}
