import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableJobCategories1745484788048
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
                  CREATE TABLE job_categories (
                      id CHAR(36) PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      deleted_at TIMESTAMP NULL,
                      created_by CHAR(36) NULL,
                      updated_by CHAR(36) NULL,
                      deleted_by CHAR(36) NULL
                  );
              `,
    );

    await queryRunner.query(`CREATE INDEX idx_name ON job_categories(name);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS job_categories');
  }
}
