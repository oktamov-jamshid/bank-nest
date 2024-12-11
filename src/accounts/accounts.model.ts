// id int [pk, increment] // Hisob ID
// user_id int [ref: > users.id] // Foydalanuvchi ID
// account_number varchar(20) [unique] // Hisob raqami
// balance float [default: 0.0] // Balans
// currency varchar(10) // Valyuta turi
// created_at datetime [default: `CURRENT_TIMESTAMP`] // Hisob yaratilgan vaqti
// }

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Transaction } from 'src/transaction/transactions.model';
import { Users } from 'src/users/users.model';

@Table({ tableName: 'accounts' })
export class Account extends Model<Account> {
  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  account_number: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  balance: number;

  @Column({
    type: DataType.ENUM('USD', 'EUR', 'UZB'),
    allowNull: false,
  })
  currency_type: 'USD' | 'EUR' | 'UZB';

  @BelongsTo(() => Users)
  user: Users;

  @HasMany(() => Transaction, { foreignKey: 'from_account' })
  fromTransactions: Transaction[]; // Kimdan pul ketayotgan tranzaksiyalar

  @HasMany(() => Transaction, { foreignKey: 'to_account' })
  toTransactions: Transaction[]; // Kimga pul kelayotgan tranzaksiyalar

  // Qo'yilgan o'zgarishlar
}
