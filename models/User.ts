//@ts-nocheck
import { Model } from "objection";
import Consumer from "./Consumer";
import Driver from "./Driver";
import Person from "./Person";

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
  };
}
