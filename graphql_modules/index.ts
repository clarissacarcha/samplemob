// Constains all modules that are representations of models
import Models from "./model/";

// Constains all modules not present in databse
import Virtuals from "./virtual";

export default {
  ...Models,
  ...Virtuals,
};
