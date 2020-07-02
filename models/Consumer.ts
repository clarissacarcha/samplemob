//@ts-nocheck
import { Model } from "objection";

export default class extends Model {
  static tableName = "tok_consumers";
  static idColumn = "id";
}
