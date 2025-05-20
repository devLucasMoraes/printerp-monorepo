import { MigrationInterface, QueryRunner } from 'typeorm'

export class ParceiroEntityUpdate1747771518535 implements MigrationInterface {
  name = 'ParceiroEntityUpdate1747771518535'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "parceiros" DROP COLUMN "ativo"`)
    await queryRunner.query(`ALTER TABLE "parceiros" DROP COLUMN "user_id"`)
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "parceiros" ADD "deleted_by" uuid`)
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD "organization_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_b70163b27048deb12b0caf9a2ec"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP COLUMN "parceiro_id"`,
    )
    await queryRunner.query(`ALTER TABLE "emprestimos" ADD "parceiro_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "parceiros" DROP CONSTRAINT "PK_c641dd3567834fa7ae0d67e4835"`,
    )
    await queryRunner.query(`ALTER TABLE "parceiros" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD CONSTRAINT "PK_c641dd3567834fa7ae0d67e4835" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "parceiros" DROP CONSTRAINT "UQ_1d6a17d7ebfed650263a61fb5d7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD CONSTRAINT "UQ_7c8ff3b860235a0c93d47eae945" UNIQUE ("nome", "organization_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_b70163b27048deb12b0caf9a2ec" FOREIGN KEY ("parceiro_id") REFERENCES "parceiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_b70163b27048deb12b0caf9a2ec"`,
    )
    await queryRunner.query(
      `ALTER TABLE "parceiros" DROP CONSTRAINT "UQ_7c8ff3b860235a0c93d47eae945"`,
    )
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD CONSTRAINT "UQ_1d6a17d7ebfed650263a61fb5d7" UNIQUE ("nome")`,
    )
    await queryRunner.query(
      `ALTER TABLE "parceiros" DROP CONSTRAINT "PK_c641dd3567834fa7ae0d67e4835"`,
    )
    await queryRunner.query(`ALTER TABLE "parceiros" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "parceiros" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD CONSTRAINT "PK_c641dd3567834fa7ae0d67e4835" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP COLUMN "parceiro_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD "parceiro_id" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_b70163b27048deb12b0caf9a2ec" FOREIGN KEY ("parceiro_id") REFERENCES "parceiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "parceiros" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(`ALTER TABLE "parceiros" DROP COLUMN "deleted_by"`)
    await queryRunner.query(`ALTER TABLE "parceiros" DROP COLUMN "updated_by"`)
    await queryRunner.query(`ALTER TABLE "parceiros" DROP COLUMN "created_by"`)
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD "user_id" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "parceiros" ADD "ativo" boolean NOT NULL DEFAULT true`,
    )
  }
}
