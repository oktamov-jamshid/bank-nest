import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Account } from 'src/accounts/accounts.model';


@Table({ tableName: 'users' })
export class Users extends Model<Users> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM('admin', 'worker', 'user'),
    allowNull: false,
  })
  role: 'admin' | 'worker' | 'user';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  salary?: number


  @HasMany(() => Account)
  accounts: Account[];
}
