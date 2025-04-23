import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1745414631148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE users (
                id CHAR(36) PRIMARY KEY,
                email VARCHAR(255) UNIQUE,
                name VARCHAR(255),
                phonenumber VARCHAR(15),
                password VARCHAR(255),
                role ENUM('superadmin', 'admin', 'user') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                created_by CHAR(36) NULL,
                updated_by CHAR(36) NULL,
                deleted_by CHAR(36) NULL
            );
        `,
    );

    await queryRunner.query(`CREATE INDEX idx_name ON users(name);`);
    await queryRunner.query(`CREATE INDEX idx_email ON users(email);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
