//@ts-nocheck
import { Model } from "objection";

export default class extends Model {
  static tableName = "tok_delivery_logs";
  static idColumn = "id";
}
