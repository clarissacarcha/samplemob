import { Model } from "objection";

export class Person extends Model {
  static get tableName() {
    return "tok_persons";
  }

  static get idColumn() {
    return 'id';
  }
}