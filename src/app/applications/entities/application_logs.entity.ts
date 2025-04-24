import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Application } from './application.entity';

@Entity('application_logs')
export class ApplicationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  application_id: string;

  @ManyToOne(() => Application, (application) => application.logs)
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({ type: 'integer' })
  status: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @BeforeInsert()
  private generateUUID() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
