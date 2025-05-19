import { MigrationInterface, QueryRunner } from 'typeorm'

export class RequisitanteEntityUpdate1747683765224
  implements MigrationInterface
{
  name = 'RequisitanteEntityUpdate1747683765224'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "requisitantes" DROP COLUMN "ativo"`)
    await queryRunner.query(`ALTER TABLE "requisitantes" DROP COLUMN "user_id"`)
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "requisitantes" ADD "deleted_by" uuid`)
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD "organization_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" DROP CONSTRAINT "PK_217e259327009b9ee87821bc07e"`,
    )
    await queryRunner.query(`ALTER TABLE "requisitantes" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD CONSTRAINT "PK_217e259327009b9ee87821bc07e" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" DROP CONSTRAINT "UQ_a5d6feb6a5bf80161d307bc865b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "requisitante_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "requisitante_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD CONSTRAINT "UQ_13775a2ab04c3dfef37bf4f066d" UNIQUE ("nome", "organization_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e" FOREIGN KEY ("requisitante_id") REFERENCES "requisitantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" DROP CONSTRAINT "UQ_13775a2ab04c3dfef37bf4f066d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "requisitante_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "requisitante_id" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD CONSTRAINT "UQ_a5d6feb6a5bf80161d307bc865b" UNIQUE ("nome")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" DROP CONSTRAINT "PK_217e259327009b9ee87821bc07e"`,
    )
    await queryRunner.query(`ALTER TABLE "requisitantes" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD "id" SERIAL NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD CONSTRAINT "PK_217e259327009b9ee87821bc07e" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e" FOREIGN KEY ("requisitante_id") REFERENCES "requisitantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" DROP COLUMN "deleted_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" DROP COLUMN "updated_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" DROP COLUMN "created_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD "user_id" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisitantes" ADD "ativo" boolean NOT NULL DEFAULT true`,
    )
  }
}
