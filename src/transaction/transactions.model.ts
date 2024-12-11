// Table transactions {
//     id int [pk, increment] // Tranzaksiya ID
//     from_account_id int [ref: > accounts.id] // Kimdan
//     to_account_id int [ref: > accounts.id] // Kimga
//     type varchar(20) // Tranzaksiya turi (transfer, deposit, withdraw)
//     amount float // Pul miqdori
//     timestamp datetime [default: `CURRENT_TIMESTAMP`] // Tranzaksiya vaqti
//   }

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Account } from 'src/accounts/accounts.model';

@Table({ tableName: 'transactions' })
export class Transaction extends Model<Transaction> {
  @ForeignKey(() => Account)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  from_account: number; // kimdan pul ketishi

  @ForeignKey(() => Account)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  to_account: number; // kimga pul jonatishi

  @Column({
    type: DataType.ENUM('transfer', 'deposit', 'withdraw'), // pul otkazish pul qoyish va xisobni tekshirish uchun
    allowNull: false,
  })
  transaction_type: 'transfer' | 'deposit' | 'withdraw';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  fe_percentage?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  fe_amount?: number;

  @BelongsTo(() => Account, { foreignKey: 'from_account' })
  fromAccount: Account;

  @BelongsTo(() => Account, { foreignKey: 'to_account' })
  toAccount: Account;
}
