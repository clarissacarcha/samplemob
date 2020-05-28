import { Model} from 'objection';
import Delivery from './Delivery';

export default class extends Model {
  static tableName = "tok_stops";
  static idColumn = "id";
}