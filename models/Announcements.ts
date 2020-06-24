//@ts-nocheck
import { Model } from "objection";

export default class extends Model {
  static tableName = "tok_announcements";
  static idColumn = "id";

  static afterInsert = (args) => {
    console.log("ANNOUNCEMENT HAS BEEN MADE");
  };
}
