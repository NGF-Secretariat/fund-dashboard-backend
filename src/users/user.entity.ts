import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: ['admin', 'user', 'acct', 'audit'] })
  role: 'admin' | 'user' | 'acct' | 'audit';

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Account, account => account.createdBy)
  accounts: Account[];

  @OneToMany(() => Transaction, transaction => transaction.createdBy)
  transactions: Transaction[];
}
