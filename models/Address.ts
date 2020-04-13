import { Model } from "objection";

export class Addess extends Model {
  static get tableName() {
    return "tok_addresses";
  }

  static get idColumn() {
    return 'id';
  }

}
