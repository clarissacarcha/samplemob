//@ts-nocheck
import { Model } from "objection";
import WalletLog from "./WalletLog";
import User from "./User";

export default class extends Model {
  static tableName = "tok_user_wallet";
  static idColumn = "id";

  static relationMappings = {
    walletLog: {
      relation: Model.HasManyRelation,
      modelClass: WalletLog,
      join: {
        from: "tok_user_wallet.id",
        to: "tok_user_wallet_logs.tok_wallet_id",
      },
    },
    user: {
      relation: Model.HasManyRelation,
      modelClass: User,
      join: {
        from: "tok_user_wallet.tok_users_id",
        to: "tok_users.id",
      },
    },
  };
}
