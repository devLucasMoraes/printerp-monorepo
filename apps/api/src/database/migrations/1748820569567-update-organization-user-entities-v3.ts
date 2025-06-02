import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateOrganizationUserEntitiesV31748820569567
  implements MigrationInterface
{
  name = 'UpdateOrganizationUserEntitiesV31748820569567'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_e08c0b40ce104f44edf060126fe"`,
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`)
    await queryRunner.query(`ALTER TABLE "organizations" ADD "owner" uuid`)
    await queryRunner.query(
      `ALTER TABLE "organizations" ALTER COLUMN "owner_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_4376bc59717cf541f86fb39dcc6" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_4376bc59717cf541f86fb39dcc6"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ALTER COLUMN "owner_id" DROP NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "owner"`)
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_e08c0b40ce104f44edf060126fe" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
