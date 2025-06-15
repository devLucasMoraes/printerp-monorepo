import { MigrationInterface, QueryRunner } from 'typeorm'

export class V51749947706458 implements MigrationInterface {
  name = 'V51749947706458'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD "cod_fornecedora" character varying(255) NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP COLUMN "cod_fornecedora"`,
    )
  }
}
