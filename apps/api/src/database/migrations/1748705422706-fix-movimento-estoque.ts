import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixMovimentoEstoque1748705422706 implements MigrationInterface {
  name = 'FixMovimentoEstoque1748705422706'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" RENAME COLUMN "undidade" TO "unidade"`,
    )
    await queryRunner.query(
      `ALTER TYPE "public"."movimentos_estoque_undidade_enum" RENAME TO "movimentos_estoque_unidade_enum"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."movimentos_estoque_unidade_enum" RENAME TO "movimentos_estoque_undidade_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" RENAME COLUMN "unidade" TO "undidade"`,
    )
  }
}
