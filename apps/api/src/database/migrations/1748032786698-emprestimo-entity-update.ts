import { MigrationInterface, QueryRunner } from 'typeorm'

export class EmprestimoEntityUpdate1748032786698 implements MigrationInterface {
  name = 'EmprestimoEntityUpdate1748032786698'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "user_id"`)
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "deleted_by" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "organization_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "deleted_by" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "organization_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "emprestimos" ADD "deleted_by" uuid`)
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD "organization_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_0e425435f460653be3612b49090"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "PK_5cdb1deb1839d4a259f77a2c5d2"`,
    )
    await queryRunner.query(`ALTER TABLE "devolucao_itens" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "PK_5cdb1deb1839d4a259f77a2c5d2" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "emprestimo_item_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "emprestimo_item_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP CONSTRAINT "FK_d1ab83c0961d34e050819072d13"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP CONSTRAINT "PK_4011a8b6f6174b1ea4f00b8f9fa"`,
    )
    await queryRunner.query(`ALTER TABLE "emprestimo_itens" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD CONSTRAINT "PK_4011a8b6f6174b1ea4f00b8f9fa" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "emprestimo_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "emprestimo_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP CONSTRAINT "PK_560d61bedea3b4e5926b39766b7"`,
    )
    await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD CONSTRAINT "PK_560d61bedea3b4e5926b39766b7" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_0e425435f460653be3612b49090" FOREIGN KEY ("emprestimo_item_id") REFERENCES "emprestimo_itens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD CONSTRAINT "FK_d1ab83c0961d34e050819072d13" FOREIGN KEY ("emprestimo_id") REFERENCES "emprestimos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP CONSTRAINT "FK_d1ab83c0961d34e050819072d13"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_0e425435f460653be3612b49090"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP CONSTRAINT "PK_560d61bedea3b4e5926b39766b7"`,
    )
    await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD "id" SERIAL NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD CONSTRAINT "PK_560d61bedea3b4e5926b39766b7" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "emprestimo_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "emprestimo_id" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP CONSTRAINT "PK_4011a8b6f6174b1ea4f00b8f9fa"`,
    )
    await queryRunner.query(`ALTER TABLE "emprestimo_itens" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "id" SERIAL NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD CONSTRAINT "PK_4011a8b6f6174b1ea4f00b8f9fa" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD CONSTRAINT "FK_d1ab83c0961d34e050819072d13" FOREIGN KEY ("emprestimo_id") REFERENCES "emprestimos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "emprestimo_item_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "emprestimo_item_id" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "PK_5cdb1deb1839d4a259f77a2c5d2"`,
    )
    await queryRunner.query(`ALTER TABLE "devolucao_itens" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "id" SERIAL NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "PK_5cdb1deb1839d4a259f77a2c5d2" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_0e425435f460653be3612b49090" FOREIGN KEY ("emprestimo_item_id") REFERENCES "emprestimo_itens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP COLUMN "deleted_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP COLUMN "updated_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP COLUMN "created_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "deleted_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "updated_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "created_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "deleted_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "updated_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "created_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD "user_id" character varying(255) NOT NULL`,
    )
  }
}
