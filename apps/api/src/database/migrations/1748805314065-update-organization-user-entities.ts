import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateOrganizationUserEntities1748805314065
  implements MigrationInterface
{
  name = 'UpdateOrganizationUserEntities1748805314065'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_21a659804ed7bf61eb91688dea7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "should_attach_users_by_domain"`,
    )
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "active"`)
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "UQ_98678ed828cc71e4f8a58c95d6b"`,
    )
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "domain"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "organization_id"`)
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "deleted_at" TIMESTAMP`,
    )
    await queryRunner.query(`ALTER TABLE "organizations" ADD "deleted_by" uuid`)
    await queryRunner.query(`ALTER TABLE "organizations" ADD "user_id" uuid`)
    await queryRunner.query(
      `CREATE TYPE "public"."users_user_type_enum" AS ENUM('MASTER', 'ORGANIZATIONAL')`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "user_type" "public"."users_user_type_enum" NOT NULL DEFAULT 'MASTER'`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_by" uuid NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_by" uuid NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "users" ADD "deleted_by" uuid`)
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_245468c5a2914202a3081b1494e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_245468c5a2914202a3081b1494e"`,
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_by"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_by"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_by"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_type"`)
    await queryRunner.query(`DROP TYPE "public"."users_user_type_enum"`)
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "user_id"`)
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "deleted_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "deleted_at"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "updated_by"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "created_by"`,
    )
    await queryRunner.query(`ALTER TABLE "users" ADD "organization_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "users" ADD "active" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "domain" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "UQ_98678ed828cc71e4f8a58c95d6b" UNIQUE ("domain")`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "active" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "should_attach_users_by_domain" boolean NOT NULL DEFAULT false`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_21a659804ed7bf61eb91688dea7" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
