import { MigrationInterface, QueryRunner } from 'typeorm'

export class RequisicaoEstoqueEntityUpdate1747855444598
  implements MigrationInterface
{
  name = 'RequisicaoEstoqueEntityUpdate1747855444598'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "user_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "deleted_by" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "organization_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "deleted_by" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "organization_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP COLUMN "observacao"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD "observacao" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_221af3495763304b3a94e455cf1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "PK_d078291735274987d33366846a7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "PK_d078291735274987d33366846a7" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "requisicoes_estoque_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "requisicoes_estoque_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "PK_5ee11723bf79ec49cf429e372f5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "PK_5ee11723bf79ec49cf429e372f5" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_221af3495763304b3a94e455cf1" FOREIGN KEY ("requisicoes_estoque_id") REFERENCES "requisicoes_estoque"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_221af3495763304b3a94e455cf1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "PK_5ee11723bf79ec49cf429e372f5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "id" SERIAL NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "PK_5ee11723bf79ec49cf429e372f5" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "requisicoes_estoque_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "requisicoes_estoque_id" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "PK_d078291735274987d33366846a7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "id" SERIAL NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "PK_d078291735274987d33366846a7" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_221af3495763304b3a94e455cf1" FOREIGN KEY ("requisicoes_estoque_id") REFERENCES "requisicoes_estoque"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP COLUMN "observacao"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD "observacao" text`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "deleted_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "updated_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "created_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "deleted_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "updated_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "created_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "user_id" character varying(255) NOT NULL`,
    )
  }
}
