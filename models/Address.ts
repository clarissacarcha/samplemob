import { Model } from "objection";

export default class extends Model {
  static tableName = "tok_addresses";
  static idColumn = "id";
}
