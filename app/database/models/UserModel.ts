import { UUIDV4 } from "sequelize";
import {
  Table,
  Default,
  AllowNull,
  Unique,
  PrimaryKey,
  Model,
  Column,
  DataType,
  Sequelize,
  CreatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "users",
  timestamps: false,
})
class UserModel extends Model {
  @Default(UUIDV4())
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Unique(true)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  phone!: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isEmailVerified!: boolean;

  @CreatedAt
  @Default(Sequelize.fn("NOW"))
  @Column(DataType.DATE)
  createdAt!: Date;
}

export default UserModel;
