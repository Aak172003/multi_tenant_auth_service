import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTenantIdForeignKey1729418841699 implements MigrationInterface {
    name = "AddTenantIdForeignKey1729418841699";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "tenantIdId" integer`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_ea17f1170336ea3bc1f5100adbb" FOREIGN KEY ("tenantIdId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_ea17f1170336ea3bc1f5100adbb"`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenantIdId"`);
    }
}
