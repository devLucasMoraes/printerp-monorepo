import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1747617587905 implements MigrationInterface {
  name = 'Init1747617587905'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."members_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'MEMBER', 'BILLING')`,
    )
    await queryRunner.query(
      `CREATE TABLE "members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."members_role_enum" NOT NULL DEFAULT 'MEMBER', "organization_id" uuid, "user_id" uuid, CONSTRAINT "UQ_7ad90bd282e1be5fb2f44f41f62" UNIQUE ("organization_id", "user_id"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_ORGANIZATION" ON "members" ("organization_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_USER" ON "members" ("user_id") `,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."tokens_type_enum" AS ENUM('PASSWORD_RECOVER')`,
    )
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."tokens_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "organization_id" uuid, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "domain" character varying(255), "should_attach_users_by_domain" boolean NOT NULL DEFAULT false, "avatar_url" character varying(255), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_963693341bd612aa01ddf3a4b68" UNIQUE ("slug"), CONSTRAINT "UQ_98678ed828cc71e4f8a58c95d6b" UNIQUE ("domain"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ORGANIZATION_SLUG" ON "organizations" ("slug") `,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_provider_enum" AS ENUM('GITHUB')`,
    )
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."accounts_provider_enum" NOT NULL, "provider_account_id" character varying(255) NOT NULL, "user_id" uuid, "organization_id" uuid, CONSTRAINT "UQ_b0a347a4e389f28de99d982b103" UNIQUE ("provider_account_id"), CONSTRAINT "UQ_2ba6fba109b54b0810d9be93a02" UNIQUE ("provider", "user_id"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, "email" character varying(255), "password" character varying(255) NOT NULL, "avatar_url" character varying(255), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "organization_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "settings" ("key" character varying(255) NOT NULL, "value" text NOT NULL, "user_id" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c8639b7626fa94ba8265628f214" PRIMARY KEY ("key"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "categorias" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_6441422372f9a3bdd1145dece14" UNIQUE ("nome", "organization_id"), CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movimentos_estoque_undidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "movimentos_estoque" ("id" SERIAL NOT NULL, "tipo" character varying(50) NOT NULL, "data" TIMESTAMP NOT NULL, "quantidade" numeric(10,2) NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "undidade" "public"."movimentos_estoque_undidade_enum" NOT NULL, "documento_origem" character varying(255) NOT NULL, "tipo_documento" character varying(50) NOT NULL, "regularizado" boolean NOT NULL DEFAULT false, "estorno" boolean NOT NULL DEFAULT false, "observacao" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255) NOT NULL, "armazem_origem_id" integer, "armazem_destino_id" integer, "insumo_id" uuid, CONSTRAINT "PK_f0167ad29177850a7c4dc6d4606" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."insumos_und_estoque_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "insumos" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descricao" character varying(255) NOT NULL, "valor_unt_med" numeric(10,2) NOT NULL DEFAULT '0', "valor_unt_med_auto" boolean NOT NULL DEFAULT false, "permite_estoque_negativo" boolean NOT NULL DEFAULT false, "und_estoque" "public"."insumos_und_estoque_enum" NOT NULL, "estoque_minimo" numeric(10,2) NOT NULL DEFAULT '0', "categoria_id" uuid, CONSTRAINT "UQ_41d9fae1bbe5e8e205816a8a13f" UNIQUE ("descricao", "organization_id"), CONSTRAINT "PK_b4e1b727a7b140e698e3a3dc7af" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "estoques" ("id" SERIAL NOT NULL, "quantidade" numeric(10,2) NOT NULL DEFAULT '0', "consumo_medio_diario" numeric(10,2), "ultima_atualizacao_consumo" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "armazem_id" integer, "insumo_id" uuid, CONSTRAINT "PK_049cbdf51633449b22f020680d1" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "armazens" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255) NOT NULL, CONSTRAINT "UQ_400d1bf5d06da8279326e57c4e8" UNIQUE ("nome"), CONSTRAINT "PK_395344d5289ccafcc9dfa1ac08a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."requisicoes_estoque_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "requisicoes_estoque_itens" ("id" SERIAL NOT NULL, "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."requisicoes_estoque_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "insumos_id" uuid, "requisicoes_estoque_id" integer, CONSTRAINT "PK_d078291735274987d33366846a7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "requisitantes" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255) NOT NULL, CONSTRAINT "UQ_a5d6feb6a5bf80161d307bc865b" UNIQUE ("nome"), CONSTRAINT "PK_217e259327009b9ee87821bc07e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "requisicoes_estoque" ("id" SERIAL NOT NULL, "data_requisicao" TIMESTAMP NOT NULL, "valor_total" numeric(10,2) NOT NULL, "ordem_producao" character varying(255), "obs" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255) NOT NULL, "requisitante_id" integer, "setor_id" integer, "armazem_id" integer, CONSTRAINT "PK_5ee11723bf79ec49cf429e372f5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "setores" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255) NOT NULL, CONSTRAINT "UQ_31be2048e5e63a853a5f0bbd614" UNIQUE ("nome"), CONSTRAINT "PK_85908551895de8d968532c35d07" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "parceiros" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255) NOT NULL, CONSTRAINT "UQ_1d6a17d7ebfed650263a61fb5d7" UNIQUE ("nome"), CONSTRAINT "PK_c641dd3567834fa7ae0d67e4835" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."devolucao_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "devolucao_itens" ("id" SERIAL NOT NULL, "data_devolucao" TIMESTAMP NOT NULL, "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."devolucao_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "insumos_id" uuid, "emprestimo_item_id" integer, CONSTRAINT "PK_5cdb1deb1839d4a259f77a2c5d2" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "emprestimos" ("id" SERIAL NOT NULL, "data_emprestimo" TIMESTAMP NOT NULL, "previsao_devolucao" TIMESTAMP, "custo_estimado" numeric(10,2) NOT NULL DEFAULT '0', "tipo" character varying(255) NOT NULL, "status" character varying(255) NOT NULL DEFAULT 'EM ABERTO', "obs" character varying(255), "user_id" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "armazem_id" integer, "parceiro_id" integer, CONSTRAINT "PK_560d61bedea3b4e5926b39766b7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."emprestimo_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "emprestimo_itens" ("id" SERIAL NOT NULL, "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."emprestimo_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "insumos_id" uuid, "emprestimo_id" integer, CONSTRAINT "PK_4011a8b6f6174b1ea4f00b8f9fa" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_40c051286e8db5b4613ecb3035a" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_da404b5fd9c390e25338996e2d1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_92c77a5bf5434e1f08a899e8798" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_238d61e0f8ac37278f726efac20" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_21a659804ed7bf61eb91688dea7" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_263864180fa1722935b2c6a24fc" FOREIGN KEY ("armazem_origem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_90b151f8373e6a63f78698d28b0" FOREIGN KEY ("armazem_destino_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_af99ea2738bb30e8892c1ff408e" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "insumos" ADD CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" ADD CONSTRAINT "FK_5615b9415c67026aef69c9e0af4" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" ADD CONSTRAINT "FK_0ecc351a100765a385b8277f44f" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_2d011a3b06024eeaf2145c05cc9" FOREIGN KEY ("insumos_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_221af3495763304b3a94e455cf1" FOREIGN KEY ("requisicoes_estoque_id") REFERENCES "requisicoes_estoque"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e" FOREIGN KEY ("requisitante_id") REFERENCES "requisitantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_5eccafb9978c0fbc481b5481385" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_59461ddef30364086bda2efb849" FOREIGN KEY ("insumos_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_0e425435f460653be3612b49090" FOREIGN KEY ("emprestimo_item_id") REFERENCES "emprestimo_itens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_10c70898b81ce80bda3d0963d8a" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_b70163b27048deb12b0caf9a2ec" FOREIGN KEY ("parceiro_id") REFERENCES "parceiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD CONSTRAINT "FK_249925997b30444b2ec8be2b377" FOREIGN KEY ("insumos_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "emprestimo_itens" DROP CONSTRAINT "FK_249925997b30444b2ec8be2b377"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_b70163b27048deb12b0caf9a2ec"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_10c70898b81ce80bda3d0963d8a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_0e425435f460653be3612b49090"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_59461ddef30364086bda2efb849"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_5eccafb9978c0fbc481b5481385"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_221af3495763304b3a94e455cf1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_2d011a3b06024eeaf2145c05cc9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" DROP CONSTRAINT "FK_0ecc351a100765a385b8277f44f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" DROP CONSTRAINT "FK_5615b9415c67026aef69c9e0af4"`,
    )
    await queryRunner.query(
      `ALTER TABLE "insumos" DROP CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_af99ea2738bb30e8892c1ff408e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_90b151f8373e6a63f78698d28b0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_263864180fa1722935b2c6a24fc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_21a659804ed7bf61eb91688dea7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_238d61e0f8ac37278f726efac20"`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_92c77a5bf5434e1f08a899e8798"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_da404b5fd9c390e25338996e2d1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_40c051286e8db5b4613ecb3035a"`,
    )
    await queryRunner.query(`DROP TABLE "emprestimo_itens"`)
    await queryRunner.query(
      `DROP TYPE "public"."emprestimo_itens_unidade_enum"`,
    )
    await queryRunner.query(`DROP TABLE "emprestimos"`)
    await queryRunner.query(`DROP TABLE "devolucao_itens"`)
    await queryRunner.query(`DROP TYPE "public"."devolucao_itens_unidade_enum"`)
    await queryRunner.query(`DROP TABLE "parceiros"`)
    await queryRunner.query(`DROP TABLE "setores"`)
    await queryRunner.query(`DROP TABLE "requisicoes_estoque"`)
    await queryRunner.query(`DROP TABLE "requisitantes"`)
    await queryRunner.query(`DROP TABLE "requisicoes_estoque_itens"`)
    await queryRunner.query(
      `DROP TYPE "public"."requisicoes_estoque_itens_unidade_enum"`,
    )
    await queryRunner.query(`DROP TABLE "armazens"`)
    await queryRunner.query(`DROP TABLE "estoques"`)
    await queryRunner.query(`DROP TABLE "insumos"`)
    await queryRunner.query(`DROP TYPE "public"."insumos_und_estoque_enum"`)
    await queryRunner.query(`DROP TABLE "movimentos_estoque"`)
    await queryRunner.query(
      `DROP TYPE "public"."movimentos_estoque_undidade_enum"`,
    )
    await queryRunner.query(`DROP TABLE "categorias"`)
    await queryRunner.query(`DROP TABLE "settings"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TABLE "accounts"`)
    await queryRunner.query(`DROP TYPE "public"."accounts_provider_enum"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_ORGANIZATION_SLUG"`)
    await queryRunner.query(`DROP TABLE "organizations"`)
    await queryRunner.query(`DROP TABLE "tokens"`)
    await queryRunner.query(`DROP TYPE "public"."tokens_type_enum"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_USER"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_ORGANIZATION"`)
    await queryRunner.query(`DROP TABLE "members"`)
    await queryRunner.query(`DROP TYPE "public"."members_role_enum"`)
  }
}
