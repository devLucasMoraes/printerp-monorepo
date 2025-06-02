import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateOrganizationUserEntitiesV21748810520670
  implements MigrationInterface
{
  name = 'UpdateOrganizationUserEntitiesV21748810520670'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_245468c5a2914202a3081b1494e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" RENAME COLUMN "user_id" TO "owner_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_e08c0b40ce104f44edf060126fe" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_e08c0b40ce104f44edf060126fe"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" RENAME COLUMN "owner_id" TO "user_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_245468c5a2914202a3081b1494e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
