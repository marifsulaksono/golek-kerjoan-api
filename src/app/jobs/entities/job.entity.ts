import { JobCategory } from 'src/app/job_categories/entities/job_category.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'integer', default: 0 })
  applied: number;

  @Column({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => JobCategory, (category) => category.jobs)
  @JoinColumn({ name: 'category_id' })
  category: JobCategory;

  @Column({
    type: 'enum',
    enum: ['closed', 'open'],
    default: 'open',
  })
  status: string;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @Column({ type: 'uuid', nullable: true })
  deleted_by: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @BeforeInsert()
  private generateUUID() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
