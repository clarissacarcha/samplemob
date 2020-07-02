//@ts-nocheck
import { Model } from "objection";
import Stop from "./Stop";
import DeliveryLog from "./DeliveryLog";

export default class extends Model {
  static tableName = "tok_deliveries";
  static idColumn = "id";

  static relationMappings = {
    senderStop: {
      relation: Model.BelongsToOneRelation,
      modelClass: Stop,
      join: {
        from: "tok_deliveries.senderTokStopId",
        to: "tok_stops.id",
      },
    },
    recipientStop: {
      relation: Model.BelongsToOneRelation,
      modelClass: Stop,
      join: {
        from: "tok_deliveries.recipientTokStopId",
        to: "tok_stops.id",
      },
    },
    logs: {
      relation: Model.HasManyRelation,
      modelClass: DeliveryLog,
      join: {
        from: "tok_deliveries.id",
        to: "tok_delivery_logs.tokDeliveryId",
      },
    },
  };

  static afterInsert = (args) => {
    // console.log("AFTER INSERT DELIVERY");
  };
}

/**
 * status
 * 0 - Cancelled
 * 1 - Order Placed
 * 2 - Delivery Scheduled
 * 3 - Driver on the Way to Sender
 * 4 - Item Picked Up
 * 5 - Driver on the Way to Recipient
 * 6 - Completed
 * 7 - Cancelled
 * 8 - Expired
 */
