import { MigrationInterface, QueryRunner } from 'typeorm'

export class V31749431186391 implements MigrationInterface {
  name = 'V31749431186391'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" DROP COLUMN "data_emissao"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ADD "data_emissao" TIMESTAMP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" DROP COLUMN "data_recebimento"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ADD "data_recebimento" TIMESTAMP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" DROP COLUMN "data_recebimento"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ADD "data_recebimento" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" DROP COLUMN "data_emissao"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ADD "data_emissao" character varying(255) NOT NULL`,
    )
  }
}
