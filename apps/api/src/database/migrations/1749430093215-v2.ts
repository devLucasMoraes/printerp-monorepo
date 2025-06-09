import { MigrationInterface, QueryRunner } from 'typeorm'

export class V21749430093215 implements MigrationInterface {
  name = 'V21749430093215'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ALTER COLUMN "observacao" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ALTER COLUMN "observacao" SET NOT NULL`,
    )
  }
}
