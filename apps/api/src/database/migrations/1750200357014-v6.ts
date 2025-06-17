import { MigrationInterface, QueryRunner } from 'typeorm'

export class V61750200357014 implements MigrationInterface {
  name = 'V61750200357014'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ADD CONSTRAINT "UQ_a1682cec2fe2374963a6f263326" UNIQUE ("nfe", "chave_nfe", "organization_id")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" DROP CONSTRAINT "UQ_a1682cec2fe2374963a6f263326"`,
    )
  }
}
