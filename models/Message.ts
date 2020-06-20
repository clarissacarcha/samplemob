//@ts-nocheck
import { Model } from "objection";
import Delivery from "./Delivery";

export default class extends Model {
  static tableName = "tok_messages";
  static idColumn = "id";

  static relationMappings = {
    delivery: {
      relation: Model.BelongsToOneRelation,
      modelClass: Delivery,
      join: {
        from: "tok_messages.tokDeliveryId",
        to: "tok_deliveries.id",
      },
    },
  };
}
