//@ts-nocheck
import { Model } from "objection";

export default class extends Model {
  static tableName = "tok_user_wallet_logs";
  static idColumn = "id";
}