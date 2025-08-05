import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
@Index(['entityType', 'entityId'])
@Index(['action', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  entityType: string; // 'transaction', 'account', 'user', etc.

  @Column()
  entityId: number; // ID of the entity being audited

  @Column({ type: 'enum', enum: ['CREATE', 'UPDATE', 'DELETE'] })
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column({ type: 'text', nullable: true })
  fieldChanged: string; // For updates, which field was changed

  @Column({ type: 'text', nullable: true })
  oldValue: string; // Previous value

  @Column({ type: 'text', nullable: true })
  newValue: string; // New value

  @Column({ type: 'text', nullable: true })
  description: string; // Human readable description

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
