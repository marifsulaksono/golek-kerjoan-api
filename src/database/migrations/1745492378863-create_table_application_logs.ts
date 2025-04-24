import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableApplicationLogs1745492378863
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE application_logs (
                id CHAR(36) PRIMARY KEY,
                application_id CHAR(36) NOT NULL,
                status INT NOT NULL,
                note TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by CHAR(36) NULL,
                CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE RESTRICT ON UPDATE CASCADE
            );
          `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS application_logs;`);
  }
}
