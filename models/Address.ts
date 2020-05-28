import { Model } from "objection";

export default class extends Model {
  static get tableName() {
    return "tok_addresses";
  }

  static get idColumn() {
    return 'id';
  }

}
