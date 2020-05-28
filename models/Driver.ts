import { Model } from "objection";

export default class extends Model {
  static tableName = "tok_drivers";
  static idColumn = "id";
}
