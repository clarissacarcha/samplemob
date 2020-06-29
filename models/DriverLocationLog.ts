//@ts-nocheck
import { Model } from "objection";

export default class extends Model {
  static tableName = "tok_driver_location_logs";
  static idColumn = "id";
}
