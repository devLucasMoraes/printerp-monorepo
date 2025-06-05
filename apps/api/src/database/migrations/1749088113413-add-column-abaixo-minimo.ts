import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddColumnAbaixoMinimo1749088113413 implements MigrationInterface {
  name = 'AddColumnAbaixoMinimo1749088113413'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "estoques" ADD "abaixo_minimo" boolean NOT NULL DEFAULT false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "estoques" DROP COLUMN "abaixo_minimo"`,
    )
  }
}
