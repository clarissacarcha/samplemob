// Constains all modules that are representations of models
import Models from './model/';

//Constains all modules that are actions, state etc...
import Virtuals from './virtual';

export default {
  ...Models,
  ...Virtuals
}

