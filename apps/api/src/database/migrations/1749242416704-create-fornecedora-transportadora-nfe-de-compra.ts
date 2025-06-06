import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateFornecedoraTransportadoraNfeDeCompra1749242416704
  implements MigrationInterface
{
  name = 'CreateFornecedoraTransportadoraNfeDeCompra1749242416704'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_da404b5fd9c390e25338996e2d1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_40c051286e8db5b4613ecb3035a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_92c77a5bf5434e1f08a899e8798"`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_238d61e0f8ac37278f726efac20"`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_90b151f8373e6a63f78698d28b0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_263864180fa1722935b2c6a24fc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_af99ea2738bb30e8892c1ff408e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "insumos" DROP CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da"`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" DROP CONSTRAINT "FK_5615b9415c67026aef69c9e0af4"`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" DROP CONSTRAINT "FK_0ecc351a100765a385b8277f44f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_221af3495763304b3a94e455cf1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_2d011a3b06024eeaf2145c05cc9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_5eccafb9978c0fbc481b5481385"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_0e425435f460653be3612b49090"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_59461ddef30364086bda2efb849"`,
    )
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
    await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_ORGANIZATION"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_USER"`)
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "UQ_7ad90bd282e1be5fb2f44f41f62"`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "UQ_2ba6fba109b54b0810d9be93a02"`,
    )
    await queryRunner.query(
      `ALTER TABLE "insumos" RENAME COLUMN "categoria_id" TO "categoria"`,
    )
    await queryRunner.query(
      `CREATE TABLE "transportadoras" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome_fantasia" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, CONSTRAINT "PK_2f7deb20d07520bf7182d06d519" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "fornecedoras" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome_fantasia" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, CONSTRAINT "PK_e4ff8871da1d955dfa75b6bc73a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "nfes_de_compra" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nfe" character varying(255) NOT NULL, "chave_nfe" character varying(255) NOT NULL, "data_emissao" character varying(255) NOT NULL, "data_recebimento" character varying(255) NOT NULL, "valor_total_produtos" numeric(10,2) NOT NULL DEFAULT '0', "valor_frete" numeric(10,2) NOT NULL DEFAULT '0', "valor_total_ipi" numeric(10,2) NOT NULL DEFAULT '0', "valor_seguro" numeric(10,2) NOT NULL DEFAULT '0', "valor_desconto" numeric(10,2) NOT NULL DEFAULT '0', "valor_total_nfe" numeric(10,2) NOT NULL DEFAULT '0', "valor_outros" numeric(10,2) NOT NULL DEFAULT '0', "observacao" character varying(255) NOT NULL, "armazem" uuid, "fornecedora" uuid, "transportadora" uuid, CONSTRAINT "PK_653d922d4c6d5550e68fc34c6cb" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."nfes_de_compra_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`,
    )
    await queryRunner.query(
      `CREATE TABLE "nfes_de_compra_itens" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid NOT NULL, "deleted_at" TIMESTAMP, "deleted_by" uuid, "organization_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."nfes_de_compra_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "valor_ipi" numeric(10,2) NOT NULL, "descricao_fornecedora" character varying(255) NOT NULL, "referencia_fornecedora" character varying(255) NOT NULL, "insumo" uuid, "nfe_de_compra" uuid, CONSTRAINT "PK_03e66344ec715644d2848189894" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "user_id"`)
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "user_id"`)
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "user_id"`)
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP COLUMN "organization_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP COLUMN "insumo_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP COLUMN "armazem_origem_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP COLUMN "armazem_destino_id"`,
    )
    await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "insumo_id"`)
    await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "armazem_id"`)
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "insumos_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "requisicoes_estoque_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "setor_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "requisitante_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "armazem_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "insumos_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "emprestimo_item_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "insumos_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "emprestimo_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP COLUMN "armazem_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimos" DROP COLUMN "parceiro_id"`,
    )
    await queryRunner.query(`ALTER TABLE "members" ADD "organization" uuid`)
    await queryRunner.query(`ALTER TABLE "members" ADD "user" uuid`)
    await queryRunner.query(`ALTER TABLE "tokens" ADD "user" uuid`)
    await queryRunner.query(`ALTER TABLE "tokens" ADD "organization" uuid`)
    await queryRunner.query(`ALTER TABLE "accounts" ADD "user" uuid`)
    await queryRunner.query(`ALTER TABLE "accounts" ADD "organization" uuid`)
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD "armazem_origem" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD "armazem_destino" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD "insumo" uuid`,
    )
    await queryRunner.query(`ALTER TABLE "estoques" ADD "armazem" uuid`)
    await queryRunner.query(`ALTER TABLE "estoques" ADD "insumo" uuid`)
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "insumo" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "requisicao_estoque" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "requisitante" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "setor" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "armazem" uuid`,
    )
    await queryRunner.query(`ALTER TABLE "devolucao_itens" ADD "insumo" uuid`)
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "emprestimo_item" uuid`,
    )
    await queryRunner.query(`ALTER TABLE "emprestimo_itens" ADD "insumo" uuid`)
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "emprestimo" uuid`,
    )
    await queryRunner.query(`ALTER TABLE "emprestimos" ADD "armazem" uuid`)
    await queryRunner.query(`ALTER TABLE "emprestimos" ADD "parceiro" uuid`)
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_ORGANIZATION" ON "members" ("organization") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_USER" ON "members" ("user") `,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "UQ_df47247c38c8886b5554b200fc5" UNIQUE ("organization", "user")`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "UQ_ed7dff6c8248e82bdefcb5a2399" UNIQUE ("provider", "user")`,
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
      `ALTER TABLE "nfes_de_compra" ADD CONSTRAINT "FK_297643b97d99df243bced8f1e07" FOREIGN KEY ("armazem") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_de_compra" ADD CONSTRAINT "FK_933e805440b1cd7e16c1ad6a905" FOREIGN KEY ("fornecedora") REFERENCES "fornecedoras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_de_compra" ADD CONSTRAINT "FK_118bf1656b7aaaafabb812ade70" FOREIGN KEY ("transportadora") REFERENCES "transportadoras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_de_compra_itens" ADD CONSTRAINT "FK_81c0b0e17faf3dc179ecf7ae6fa" FOREIGN KEY ("insumo") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_de_compra_itens" ADD CONSTRAINT "FK_2b169c226c6dcf24b653a349cd5" FOREIGN KEY ("nfe_de_compra") REFERENCES "nfes_de_compra"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nfes_de_compra_itens" DROP CONSTRAINT "FK_2b169c226c6dcf24b653a349cd5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_de_compra_itens" DROP CONSTRAINT "FK_81c0b0e17faf3dc179ecf7ae6fa"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_de_compra" DROP CONSTRAINT "FK_118bf1656b7aaaafabb812ade70"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_de_compra" DROP CONSTRAINT "FK_933e805440b1cd7e16c1ad6a905"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nfes_de_compra" DROP CONSTRAINT "FK_297643b97d99df243bced8f1e07"`,
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
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "UQ_ed7dff6c8248e82bdefcb5a2399"`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "UQ_df47247c38c8886b5554b200fc5"`,
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_USER"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_MEMBER_ORGANIZATION"`)
    await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "parceiro"`)
    await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "armazem"`)
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "emprestimo"`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" DROP COLUMN "insumo"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "emprestimo_item"`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" DROP COLUMN "insumo"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "armazem"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "setor"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP COLUMN "requisitante"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "requisicao_estoque"`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "insumo"`,
    )
    await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "insumo"`)
    await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "armazem"`)
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP COLUMN "insumo"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP COLUMN "armazem_destino"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP COLUMN "armazem_origem"`,
    )
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "organization"`)
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "user"`)
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "organization"`)
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "user"`)
    await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "user"`)
    await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "organization"`)
    await queryRunner.query(`ALTER TABLE "emprestimos" ADD "parceiro_id" uuid`)
    await queryRunner.query(`ALTER TABLE "emprestimos" ADD "armazem_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "emprestimo_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "emprestimo_itens" ADD "insumos_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "emprestimo_item_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD "insumos_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "armazem_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "requisitante_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD "setor_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "requisicoes_estoque_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD "insumos_id" uuid`,
    )
    await queryRunner.query(`ALTER TABLE "estoques" ADD "armazem_id" uuid`)
    await queryRunner.query(`ALTER TABLE "estoques" ADD "insumo_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD "armazem_destino_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD "armazem_origem_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD "insumo_id" uuid`,
    )
    await queryRunner.query(`ALTER TABLE "accounts" ADD "organization_id" uuid`)
    await queryRunner.query(`ALTER TABLE "accounts" ADD "user_id" uuid`)
    await queryRunner.query(`ALTER TABLE "tokens" ADD "organization_id" uuid`)
    await queryRunner.query(`ALTER TABLE "tokens" ADD "user_id" uuid`)
    await queryRunner.query(`ALTER TABLE "members" ADD "user_id" uuid`)
    await queryRunner.query(`ALTER TABLE "members" ADD "organization_id" uuid`)
    await queryRunner.query(`DROP TABLE "nfes_de_compra_itens"`)
    await queryRunner.query(
      `DROP TYPE "public"."nfes_de_compra_itens_unidade_enum"`,
    )
    await queryRunner.query(`DROP TABLE "nfes_de_compra"`)
    await queryRunner.query(`DROP TABLE "fornecedoras"`)
    await queryRunner.query(`DROP TABLE "transportadoras"`)
    await queryRunner.query(
      `ALTER TABLE "insumos" RENAME COLUMN "categoria" TO "categoria_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "UQ_2ba6fba109b54b0810d9be93a02" UNIQUE ("provider", "user_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "UQ_7ad90bd282e1be5fb2f44f41f62" UNIQUE ("organization_id", "user_id")`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_USER" ON "members" ("user_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_MEMBER_ORGANIZATION" ON "members" ("organization_id") `,
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
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_59461ddef30364086bda2efb849" FOREIGN KEY ("insumos_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_0e425435f460653be3612b49090" FOREIGN KEY ("emprestimo_item_id") REFERENCES "emprestimo_itens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_5eccafb9978c0fbc481b5481385" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e" FOREIGN KEY ("requisitante_id") REFERENCES "requisitantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_2d011a3b06024eeaf2145c05cc9" FOREIGN KEY ("insumos_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_221af3495763304b3a94e455cf1" FOREIGN KEY ("requisicoes_estoque_id") REFERENCES "requisicoes_estoque"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" ADD CONSTRAINT "FK_0ecc351a100765a385b8277f44f" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "estoques" ADD CONSTRAINT "FK_5615b9415c67026aef69c9e0af4" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "insumos" ADD CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_af99ea2738bb30e8892c1ff408e" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_263864180fa1722935b2c6a24fc" FOREIGN KEY ("armazem_origem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_90b151f8373e6a63f78698d28b0" FOREIGN KEY ("armazem_destino_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_238d61e0f8ac37278f726efac20" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_92c77a5bf5434e1f08a899e8798" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_40c051286e8db5b4613ecb3035a" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_da404b5fd9c390e25338996e2d1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
