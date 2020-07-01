//@ts-nocheck
// Constains all modules that are representations of models
import Models, { adminModelModules } from "./model/";

// Constains all modules not present in databse
import Virtuals, { adminVirtualModules } from "./virtual";

export default {
  ...Models,
  ...Virtuals,
};

export const AdminGraphQLModules = {
  ...adminModelModules,
  ...adminVirtualModules,
};
