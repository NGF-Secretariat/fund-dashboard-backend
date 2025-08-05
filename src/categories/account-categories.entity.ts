import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity()
export class AccountCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['secretariat', 'project'] })
  name: 'secretariat' | 'project';

  @OneToMany(() => Account, account => account.category)
  accounts: Account[];
}
