import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'token_auth' })
export class TokenAuth {
  @PrimaryColumn({ type: 'text' })
  token: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar' })
  ip_address: string;
}
