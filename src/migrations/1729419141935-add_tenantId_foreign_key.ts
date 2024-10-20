import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTenantIdForeignKey1729419141935 implements MigrationInterface {
    name = "AddTenantIdForeignKey1729419141935";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_ea17f1170336ea3bc1f5100adbb"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" RENAME COLUMN "tenantIdId" TO "tenantId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" RENAME COLUMN "tenantId" TO "tenantIdId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_ea17f1170336ea3bc1f5100adbb" FOREIGN KEY ("tenantIdId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
