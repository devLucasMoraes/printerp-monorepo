import { MigrationInterface, QueryRunner } from "typeorm";

export class ArmazemEntityUpdate1747687793879 implements MigrationInterface {
    name = 'ArmazemEntityUpdate1747687793879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "armazens" DROP COLUMN "ativo"`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD "created_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD "updated_by" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD "deleted_by" uuid`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD "organization_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_263864180fa1722935b2c6a24fc"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_90b151f8373e6a63f78698d28b0"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "armazem_origem_id"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "armazem_origem_id" uuid`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "armazem_destino_id"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "armazem_destino_id" uuid`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP CONSTRAINT "FK_5615b9415c67026aef69c9e0af4"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "armazem_id"`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "armazem_id" uuid`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9"`);
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_10c70898b81ce80bda3d0963d8a"`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP CONSTRAINT "PK_395344d5289ccafcc9dfa1ac08a"`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD CONSTRAINT "PK_395344d5289ccafcc9dfa1ac08a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP CONSTRAINT "UQ_400d1bf5d06da8279326e57c4e8"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP COLUMN "armazem_id"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD "armazem_id" uuid`);
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "armazem_id"`);
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD "armazem_id" uuid`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD CONSTRAINT "UQ_54a87e6e655e5d96a08188f1742" UNIQUE ("nome", "organization_id")`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_263864180fa1722935b2c6a24fc" FOREIGN KEY ("armazem_origem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_90b151f8373e6a63f78698d28b0" FOREIGN KEY ("armazem_destino_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD CONSTRAINT "FK_5615b9415c67026aef69c9e0af4" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_10c70898b81ce80bda3d0963d8a" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_10c70898b81ce80bda3d0963d8a"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP CONSTRAINT "FK_5615b9415c67026aef69c9e0af4"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_90b151f8373e6a63f78698d28b0"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_263864180fa1722935b2c6a24fc"`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP CONSTRAINT "UQ_54a87e6e655e5d96a08188f1742"`);
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "armazem_id"`);
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD "armazem_id" integer`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP COLUMN "armazem_id"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD "armazem_id" integer`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD CONSTRAINT "UQ_400d1bf5d06da8279326e57c4e8" UNIQUE ("nome")`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP CONSTRAINT "PK_395344d5289ccafcc9dfa1ac08a"`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD CONSTRAINT "PK_395344d5289ccafcc9dfa1ac08a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_10c70898b81ce80bda3d0963d8a" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "armazem_id"`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "armazem_id" integer`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD CONSTRAINT "FK_5615b9415c67026aef69c9e0af4" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "armazem_destino_id"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "armazem_destino_id" integer`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "armazem_origem_id"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "armazem_origem_id" integer`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_90b151f8373e6a63f78698d28b0" FOREIGN KEY ("armazem_destino_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_263864180fa1722935b2c6a24fc" FOREIGN KEY ("armazem_origem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP COLUMN "organization_id"`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP COLUMN "deleted_by"`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD "user_id" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD "ativo" boolean NOT NULL DEFAULT true`);
    }

}
