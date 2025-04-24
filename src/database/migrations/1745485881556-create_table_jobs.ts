import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableJobs1745485881556 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
                CREATE TABLE jobs (
                    id CHAR(36) PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT NULL,
                    image_url TEXT NULL,
                    applied INT DEFAULT 0,
                    status ENUM('open', 'closed') DEFAULT 'open',
                    category_id CHAR(36) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    deleted_at TIMESTAMP NULL,
                    created_by CHAR(36) NULL,
                    updated_by CHAR(36) NULL,
                    deleted_by CHAR(36) NULL,
                    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES job_categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
                );
            `,
    );

    await queryRunner.query(`CREATE INDEX idx_title ON jobs(title);`);
    await queryRunner.query(`CREATE INDEX idx_status ON jobs(status);`);
    await queryRunner.query(
      `CREATE INDEX idx_category_id ON jobs(category_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS jobs');
  }
}
