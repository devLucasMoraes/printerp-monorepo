import { MigrationInterface, QueryRunner } from 'typeorm'

export class V41749922680118 implements MigrationInterface {
  name = 'V41749922680118'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP CONSTRAINT "FK_aa2a68f4268fee5c0fb88412e9e"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."vinculos_und_compra_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "vinculos" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cod" character varying(255) NOT NULL, "und_compra" "public"."vinculos_und_compra_enum" NOT NULL, "possui_conversao" boolean NOT NULL DEFAULT false, "qtde_embabalagem" numeric(10,2), "insumo_id" uuid NOT NULL, "fornecedora_id" uuid NOT NULL, "fornecedora" uuid, "insumo" uuid, CONSTRAINT "UQ_34ee97e0e8e890fcca6d14fa7a0" UNIQUE ("cod", "insumo_id", "fornecedora_id", "und_compra", "organization_id"), CONSTRAINT "PK_bcee4d405ebd42d1ffd77fa11b8" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP COLUMN "referencia_fornecedora"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP COLUMN "quantidade"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP COLUMN "insumo"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP COLUMN "unidade"`,
    )
    await queryRunner.query(
      `DROP TYPE "public"."nfe_compra_itens_unidade_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD "qtde_nf" numeric(10,2) NOT NULL`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."nfe_compra_itens_unidade_nf_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD "unidade_nf" "public"."nfe_compra_itens_unidade_nf_enum" NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "nfe_compra_itens" ADD "vinculo" uuid`)
    await queryRunner.query(
      `ALTER TABLE "vinculos" ADD CONSTRAINT "FK_c91922a3de6997e970654cbb91e" FOREIGN KEY ("fornecedora") REFERENCES "fornecedoras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "vinculos" ADD CONSTRAINT "FK_406994d40d430e06df00621a61d" FOREIGN KEY ("insumo") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD CONSTRAINT "FK_1bda28389d4740882ab498c9ed5" FOREIGN KEY ("vinculo") REFERENCES "vinculos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP CONSTRAINT "FK_1bda28389d4740882ab498c9ed5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "vinculos" DROP CONSTRAINT "FK_406994d40d430e06df00621a61d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "vinculos" DROP CONSTRAINT "FK_c91922a3de6997e970654cbb91e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP COLUMN "vinculo"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP COLUMN "unidade_nf"`,
    )
    await queryRunner.query(
      `DROP TYPE "public"."nfe_compra_itens_unidade_nf_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP COLUMN "qtde_nf"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."nfe_compra_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD "unidade" "public"."nfe_compra_itens_unidade_enum" NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "nfe_compra_itens" ADD "insumo" uuid`)
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD "quantidade" numeric(10,2) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD "referencia_fornecedora" character varying(255) NOT NULL`,
    )
    await queryRunner.query(`DROP TABLE "vinculos"`)
    await queryRunner.query(`DROP TYPE "public"."vinculos_und_compra_enum"`)
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD CONSTRAINT "FK_aa2a68f4268fee5c0fb88412e9e" FOREIGN KEY ("insumo") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
