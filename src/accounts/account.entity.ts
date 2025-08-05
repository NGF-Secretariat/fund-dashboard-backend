import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Bank } from 'src/banks/bank.entity';
import { Currency } from 'src/currencies/currencies.entity';
import { AccountCategory } from 'src/categories/account-categories.entity';
import { User } from 'src/users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
@Index(['accountNumber'], { unique: true })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, unique: true })
  accountNumber: string;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn({ name: 'currency_id'})
  currency: Currency;

  @ManyToOne(() => AccountCategory)
  @JoinColumn({ name: 'category_id' })
  category: AccountCategory;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];

  @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
