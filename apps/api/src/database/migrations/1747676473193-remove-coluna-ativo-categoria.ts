import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveColunaAtivoCategoria1747676473193
  implements MigrationInterface
{
  name = 'RemoveColunaAtivoCategoria1747676473193'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "ativo"`)
    await queryRunner.query(`ALTER TABLE "setores" DROP COLUMN "ativo"`)
    await queryRunner.query(`ALTER TABLE "setores" DROP COLUMN "user_id"`)
    await queryRunner.query(
      `ALTER TABLE "setores" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "setores" ADD "deleted_by" uuid`)
    await queryRunner.query(
      `ALTER TABLE "setores" ADD "organization_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_5eccafb9978c0fbc481b5481385"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "setor_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "setor_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT "PK_85908551895de8d968532c35d07"`,
    )
    await queryRunner.query(`ALTER TABLE "setores" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "setores" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "PK_85908551895de8d968532c35d07" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT "UQ_31be2048e5e63a853a5f0bbd614"`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "UQ_f2a0889ba76ee884d892e6484fc" UNIQUE ("nome", "organization_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_5eccafb9978c0fbc481b5481385" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_5eccafb9978c0fbc481b5481385"`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT "UQ_f2a0889ba76ee884d892e6484fc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "UQ_31be2048e5e63a853a5f0bbd614" UNIQUE ("nome")`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT "PK_85908551895de8d968532c35d07"`,
    )
    await queryRunner.query(`ALTER TABLE "setores" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "setores" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "PK_85908551895de8d968532c35d07" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "setor_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "setor_id" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_5eccafb9978c0fbc481b5481385" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(`ALTER TABLE "setores" DROP COLUMN "deleted_by"`)
    await queryRunner.query(`ALTER TABLE "setores" DROP COLUMN "updated_by"`)
    await queryRunner.query(`ALTER TABLE "setores" DROP COLUMN "created_by"`)
    await queryRunner.query(
      `ALTER TABLE "setores" ADD "user_id" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "setores" ADD "ativo" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "categorias" ADD "ativo" boolean NOT NULL DEFAULT true`,
    )
  }
}
