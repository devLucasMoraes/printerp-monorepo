import { MigrationInterface, QueryRunner } from 'typeorm'

export class V71752963251704 implements MigrationInterface {
  name = 'V71752963251704'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ADD "add_estoque" boolean NOT NULL DEFAULT true`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" DROP COLUMN "add_estoque"`,
    )
  }
}
