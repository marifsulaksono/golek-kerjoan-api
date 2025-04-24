import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableApplications1745492000574
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE applications (
                id CHAR(36) PRIMARY KEY,
                job_id CHAR(36) NOT NULL,
                user_id CHAR(36) NOT NULL,
                status INT NOT NULL DEFAULT 1,
                attachment_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                created_by CHAR(36) NULL,
                updated_by CHAR(36) NULL,
                deleted_by CHAR(36) NULL,
                CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
            );
          `,
    );

    await queryRunner.query(`CREATE INDEX idx_status ON applications(status);`);
    await queryRunner.query(`CREATE INDEX idx_job_id ON applications(job_id);`);
    await queryRunner.query(
      `CREATE INDEX idx_user_id ON applications(user_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    await queryRunner.query(
      `ALTER TABLE applications DROP FOREIGN KEY fk_user;`,
    );
    await queryRunner.query(
      `ALTER TABLE applications DROP FOREIGN KEY fk_job;`,
    );

    // Drop indexes (safe after constraints removed)
    await queryRunner.query(`DROP INDEX idx_user_id ON applications;`);
    await queryRunner.query(`DROP INDEX idx_job_id ON applications;`);
    await queryRunner.query(`DROP INDEX idx_status ON applications;`);
    await queryRunner.query(`DROP TABLE IF EXISTS applications;`);
  }
}
