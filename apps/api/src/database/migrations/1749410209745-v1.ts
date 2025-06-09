import { MigrationInterface, QueryRunner } from 'typeorm'

export class V11749410209745 implements MigrationInterface {
  name = 'V11749410209745'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."members_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'MEMBER', 'BILLING')`,
    )
    await queryRunner.query(
      `CREATE TABLE "members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."members_role_enum" NOT NULL DEFAULT 'MEMBER', "organization" uuid, "user" uuid, CONSTRAINT "UQ_df47247c38c8886b5554b200fc5" UNIQUE ("organization", "user"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_ORGANIZATION" ON "members" ("organization") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_USER" ON "members" ("user") `,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."tokens_type_enum" AS ENUM('PASSWORD_RECOVER')`,
    )
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."tokens_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user" uuid, "organization" uuid, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "avatar_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "owner_id" uuid NOT NULL, "owner" uuid, CONSTRAINT "UQ_963693341bd612aa01ddf3a4b68" UNIQUE ("slug"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ORGANIZATION_SLUG" ON "organizations" ("slug") `,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_provider_enum" AS ENUM('GITHUB')`,
    )
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."accounts_provider_enum" NOT NULL, "provider_account_id" character varying(255) NOT NULL, "user" uuid, "organization" uuid, CONSTRAINT "UQ_b0a347a4e389f28de99d982b103" UNIQUE ("provider_account_id"), CONSTRAINT "UQ_ed7dff6c8248e82bdefcb5a2399" UNIQUE ("provider", "user"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."users_user_type_enum" AS ENUM('MASTER', 'ORGANIZATIONAL')`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "avatar_url" character varying(255), "user_type" "public"."users_user_type_enum" NOT NULL DEFAULT 'MASTER', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP, "deleted_by" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "transportadoras" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome_fantasia" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, CONSTRAINT "UQ_90070d218ef0ca04e1101626db9" UNIQUE ("cnpj", "organization_id"), CONSTRAINT "PK_2f7deb20d07520bf7182d06d519" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "settings" ("key" character varying(255) NOT NULL, "value" text NOT NULL, "user_id" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c8639b7626fa94ba8265628f214" PRIMARY KEY ("key"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "categorias" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, CONSTRAINT "UQ_6441422372f9a3bdd1145dece14" UNIQUE ("nome", "organization_id"), CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movimentos_estoque_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "movimentos_estoque" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo" character varying(50) NOT NULL, "data" TIMESTAMP NOT NULL, "quantidade" numeric(10,2) NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "unidade" "public"."movimentos_estoque_unidade_enum" NOT NULL, "documento_origem_id" uuid NOT NULL, "tipo_documento" character varying(50) NOT NULL, "estorno" boolean NOT NULL DEFAULT false, "observacao" character varying(255), "armazem_origem" uuid, "armazem_destino" uuid, "insumo" uuid, CONSTRAINT "PK_f0167ad29177850a7c4dc6d4606" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."insumos_und_estoque_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "insumos" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descricao" character varying(255) NOT NULL, "valor_unt_med" numeric(10,2) NOT NULL DEFAULT '0', "valor_unt_med_auto" boolean NOT NULL DEFAULT false, "permite_estoque_negativo" boolean NOT NULL DEFAULT false, "und_estoque" "public"."insumos_und_estoque_enum" NOT NULL, "estoque_minimo" numeric(10,2) NOT NULL DEFAULT '0', "abaixo_minimo" boolean NOT NULL DEFAULT false, "categoria" uuid, CONSTRAINT "UQ_41d9fae1bbe5e8e205816a8a13f" UNIQUE ("descricao", "organization_id"), CONSTRAINT "PK_b4e1b727a7b140e698e3a3dc7af" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "estoques" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantidade" numeric(10,2) NOT NULL DEFAULT '0', "consumo_medio_diario" numeric(10,2), "ultima_atualizacao_consumo" TIMESTAMP, "abaixo_minimo" boolean NOT NULL DEFAULT false, "armazem" uuid, "insumo" uuid, CONSTRAINT "PK_049cbdf51633449b22f020680d1" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "armazens" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, CONSTRAINT "UQ_54a87e6e655e5d96a08188f1742" UNIQUE ("nome", "organization_id"), CONSTRAINT "PK_395344d5289ccafcc9dfa1ac08a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."requisicoes_estoque_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "requisicoes_estoque_itens" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."requisicoes_estoque_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "insumo" uuid, "requisicao_estoque" uuid, CONSTRAINT "PK_d078291735274987d33366846a7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "requisitantes" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, CONSTRAINT "UQ_13775a2ab04c3dfef37bf4f066d" UNIQUE ("nome", "organization_id"), CONSTRAINT "PK_217e259327009b9ee87821bc07e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "requisicoes_estoque" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_requisicao" TIMESTAMP NOT NULL, "valor_total" numeric(10,2) NOT NULL, "ordem_producao" character varying(255), "obs" character varying(255), "requisitante" uuid, "setor" uuid, "armazem" uuid, CONSTRAINT "PK_5ee11723bf79ec49cf429e372f5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "setores" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, CONSTRAINT "UQ_f2a0889ba76ee884d892e6484fc" UNIQUE ("nome", "organization_id"), CONSTRAINT "PK_85908551895de8d968532c35d07" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."devolucao_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "devolucao_itens" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_devolucao" TIMESTAMP NOT NULL, "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."devolucao_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "insumo" uuid, "emprestimo_item" uuid, CONSTRAINT "PK_5cdb1deb1839d4a259f77a2c5d2" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."emprestimo_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "emprestimo_itens" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."emprestimo_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "insumo" uuid, "emprestimo" uuid, CONSTRAINT "PK_4011a8b6f6174b1ea4f00b8f9fa" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "emprestimos" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_emprestimo" TIMESTAMP NOT NULL, "previsao_devolucao" TIMESTAMP, "custo_estimado" numeric(10,2) NOT NULL DEFAULT '0', "tipo" character varying(255) NOT NULL, "status" character varying(255) NOT NULL DEFAULT 'EM ABERTO', "obs" character varying(255), "armazem" uuid, "parceiro" uuid, CONSTRAINT "PK_560d61bedea3b4e5926b39766b7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "parceiros" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, CONSTRAINT "UQ_7c8ff3b860235a0c93d47eae945" UNIQUE ("nome", "organization_id"), CONSTRAINT "PK_c641dd3567834fa7ae0d67e4835" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "fornecedoras" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome_fantasia" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, CONSTRAINT "UQ_8435254d163720b421924f25474" UNIQUE ("cnpj", "organization_id"), CONSTRAINT "PK_e4ff8871da1d955dfa75b6bc73a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "nfes_compra" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nfe" character varying(255) NOT NULL, "chave_nfe" character varying(255) NOT NULL, "data_emissao" character varying(255) NOT NULL, "data_recebimento" character varying(255) NOT NULL, "valor_total_produtos" numeric(10,2) NOT NULL DEFAULT '0', "valor_frete" numeric(10,2) NOT NULL DEFAULT '0', "valor_total_ipi" numeric(10,2) NOT NULL DEFAULT '0', "valor_seguro" numeric(10,2) NOT NULL DEFAULT '0', "valor_desconto" numeric(10,2) NOT NULL DEFAULT '0', "valor_total_nfe" numeric(10,2) NOT NULL DEFAULT '0', "valor_outros" numeric(10,2) NOT NULL DEFAULT '0', "observacao" character varying(255) NOT NULL, "armazem" uuid, "fornecedora" uuid, "transportadora" uuid, CONSTRAINT "PK_bcc459a0b42ebe8af7e3ac4b996" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."nfe_compra_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "nfe_compra_itens" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."nfe_compra_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "valor_ipi" numeric(10,2) NOT NULL, "descricao_fornecedora" character varying(255) NOT NULL, "referencia_fornecedora" character varying(255) NOT NULL, "insumo" uuid, "nfe_compra" uuid, CONSTRAINT "PK_73352e97a16b1f75a6197208e17" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_6f279bf3408ad15292c6c36e20b" FOREIGN KEY ("organization") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_b7a1659b22ee22309b422dafe65" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_20a1c32e04c1bde78d3f277ba6e" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_f7590ebbd8aae91cdeeeab997c7" FOREIGN KEY ("organization") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_4376bc59717cf541f86fb39dcc6" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_4fece97ff9cd4a96f56a412a528" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_e6e534cb2497f01045124fbc8f2" FOREIGN KEY ("organization") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_a759dab561d0248f020c3aef83a" FOREIGN KEY ("armazem_origem") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_6395a70fe4828707ea350cbb149" FOREIGN KEY ("armazem_destino") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_bd08c560acdfb5bdee695ebbbc1" FOREIGN KEY ("insumo") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "insumos" ADD CONSTRAINT "FK_7fdffb4e1df79a50ff5f1ee0460" FOREIGN KEY ("categoria") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" ADD CONSTRAINT "FK_0296d9784c35418bc6a1aa02345" FOREIGN KEY ("armazem") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" ADD CONSTRAINT "FK_5962c20ccdceaee4b84416c1e47" FOREIGN KEY ("insumo") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_ae91be180123a77993738a82c2d" FOREIGN KEY ("insumo") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_a111d602379863d0273885f50b9" FOREIGN KEY ("requisicao_estoque") REFERENCES "requisicoes_estoque"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_0e306c8971f76a5fc32122d6143" FOREIGN KEY ("requisitante") REFERENCES "requisitantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_f9368a3a28b7627f4d8529435f4" FOREIGN KEY ("setor") REFERENCES "setores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_0aeba4be5eca71b497d704a89ba" FOREIGN KEY ("armazem") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_0eec2c595dfdb20c8d5826faa54" FOREIGN KEY ("insumo") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_a18c2c18bff0f32d1c648f26ec1" FOREIGN KEY ("emprestimo_item") REFERENCES "emprestimo_itens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD CONSTRAINT "FK_458448ed934506c63d1ff21c948" FOREIGN KEY ("insumo") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD CONSTRAINT "FK_235cf10fd4e734ea87dedfd2dc6" FOREIGN KEY ("emprestimo") REFERENCES "emprestimos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_a5f8b0a85b14e647e240c998645" FOREIGN KEY ("armazem") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_31373b96757dd95d1005c109358" FOREIGN KEY ("parceiro") REFERENCES "parceiros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ADD CONSTRAINT "FK_fbce318f870538669cf023449d7" FOREIGN KEY ("armazem") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ADD CONSTRAINT "FK_9ddc0c4b749a9f82299de033835" FOREIGN KEY ("fornecedora") REFERENCES "fornecedoras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" ADD CONSTRAINT "FK_35498cca164993092e8bde835bc" FOREIGN KEY ("transportadora") REFERENCES "transportadoras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD CONSTRAINT "FK_aa2a68f4268fee5c0fb88412e9e" FOREIGN KEY ("insumo") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" ADD CONSTRAINT "FK_a88eb7acec5c24e1c63edb11ef7" FOREIGN KEY ("nfe_compra") REFERENCES "nfes_compra"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP CONSTRAINT "FK_a88eb7acec5c24e1c63edb11ef7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfe_compra_itens" DROP CONSTRAINT "FK_aa2a68f4268fee5c0fb88412e9e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" DROP CONSTRAINT "FK_35498cca164993092e8bde835bc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" DROP CONSTRAINT "FK_9ddc0c4b749a9f82299de033835"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_compra" DROP CONSTRAINT "FK_fbce318f870538669cf023449d7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_31373b96757dd95d1005c109358"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_a5f8b0a85b14e647e240c998645"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP CONSTRAINT "FK_235cf10fd4e734ea87dedfd2dc6"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP CONSTRAINT "FK_458448ed934506c63d1ff21c948"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_a18c2c18bff0f32d1c648f26ec1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_0eec2c595dfdb20c8d5826faa54"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_0aeba4be5eca71b497d704a89ba"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_f9368a3a28b7627f4d8529435f4"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_0e306c8971f76a5fc32122d6143"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_a111d602379863d0273885f50b9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_ae91be180123a77993738a82c2d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" DROP CONSTRAINT "FK_5962c20ccdceaee4b84416c1e47"`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" DROP CONSTRAINT "FK_0296d9784c35418bc6a1aa02345"`,
    )
    await queryRunner.query(
      `ALTER TABLE "insumos" DROP CONSTRAINT "FK_7fdffb4e1df79a50ff5f1ee0460"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_bd08c560acdfb5bdee695ebbbc1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_6395a70fe4828707ea350cbb149"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_a759dab561d0248f020c3aef83a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_e6e534cb2497f01045124fbc8f2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_4fece97ff9cd4a96f56a412a528"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_4376bc59717cf541f86fb39dcc6"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_f7590ebbd8aae91cdeeeab997c7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_20a1c32e04c1bde78d3f277ba6e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_b7a1659b22ee22309b422dafe65"`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_6f279bf3408ad15292c6c36e20b"`,
    )
    await queryRunner.query(`DROP TABLE "nfe_compra_itens"`)
    await queryRunner.query(
      `DROP TYPE "public"."nfe_compra_itens_unidade_enum"`,
    )
    await queryRunner.query(`DROP TABLE "nfes_compra"`)
    await queryRunner.query(`DROP TABLE "fornecedoras"`)
    await queryRunner.query(`DROP TABLE "parceiros"`)
    await queryRunner.query(`DROP TABLE "emprestimos"`)
    await queryRunner.query(`DROP TABLE "emprestimo_itens"`)
    await queryRunner.query(
      `DROP TYPE "public"."emprestimo_itens_unidade_enum"`,
    )
    await queryRunner.query(`DROP TABLE "devolucao_itens"`)
    await queryRunner.query(`DROP TYPE "public"."devolucao_itens_unidade_enum"`)
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
      `DROP TYPE "public"."movimentos_estoque_unidade_enum"`,
    )
    await queryRunner.query(`DROP TABLE "categorias"`)
    await queryRunner.query(`DROP TABLE "settings"`)
    await queryRunner.query(`DROP TABLE "transportadoras"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TYPE "public"."users_user_type_enum"`)
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
