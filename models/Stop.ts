//@ts-nocheck
import { Model } from "objection";
import Address from "./Address";

export default class extends Model {
  static tableName = "tok_stops";
  static idColumn = "id";

  static relationMappings = {
    address: {
      relation: Model.HasOneRelation,
      modelClass: Address,
      join: {
        from: "tok_stops.addressId",
        to: "tok_addresses.id",
      },
    },
  };
}
