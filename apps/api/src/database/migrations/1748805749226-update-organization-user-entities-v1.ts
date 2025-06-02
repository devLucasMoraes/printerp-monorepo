import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateOrganizationUserEntitiesV11748805749226
  implements MigrationInterface
{
  name = 'UpdateOrganizationUserEntitiesV11748805749226'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "created_by" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "updated_by" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "updated_by" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "created_by" SET NOT NULL`,
    )
  }
}
