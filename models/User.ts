//@ts-nocheck
import { Model } from "objection";
import Consumer from "./Consumer";
import Driver from "./Driver";
import Person from "./Person";
import Wallet from "./Wallet";

export default class extends Model {
  static tableName = "tok_users";
  static idColumn = "id";

  static relationMappings = {
    driver: {
      relation: Model.HasOneRelation,
      modelClass: Driver,
      join: {
        from: "tok_users.id",
        to: "tok_drivers.tokUserId",
      },
    },
    person: {
      relation: Model.HasOneRelation,
      modelClass: Person,
      join: {
        from: "tok_users.id",
        to: "tok_persons.tokUserId",
      },
    },
    consumer: {
      relation: Model.HasOneRelation,
      modelClass: Consumer,
      join: {
        from: "tok_users.id",
        to: "tok_consumers.tokUserId",
      },
    },
    wallet: {
      relation: Model.HasOneRelation,
      modelClass: Wallet,
      join: {
        from: "tok_users.id",
        to: "tok_user_wallets.tok_user_id",
      },
    },
  };
}
