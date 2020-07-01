//@ts-nocheck
import { Model } from "objection";

export default class extends Model {
  static tableName = "tok_cargo_types";
  static idColumn = "id";
}
