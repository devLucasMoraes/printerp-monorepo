import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddColumnAbaixoMinimoInsumo1749091058468
  implements MigrationInterface
{
  name = 'AddColumnAbaixoMinimoInsumo1749091058468'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "insumos" ADD "abaixo_minimo" boolean NOT NULL DEFAULT false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "insumos" DROP COLUMN "abaixo_minimo"`)
  }
}
