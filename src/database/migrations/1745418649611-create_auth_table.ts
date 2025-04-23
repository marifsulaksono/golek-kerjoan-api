import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTable1745418649611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
              CREATE TABLE token_auth (
                  token TEXT NOT NULL,
                  user_id CHAR(36) NOT NULL,
                  ip_address VARCHAR(50) NOT NULL,
                  CONSTRAINT unique_user_agent_ip UNIQUE (user_id, ip_address)
              );
          `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS token_auth');
  }
}
