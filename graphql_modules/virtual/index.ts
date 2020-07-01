import AdminAPIModule from "./AdminAPI";
import AuthModule from "./Auth";
import CommonModule from "./Common";
import DeliveryDispatchModule from "./DeliveryDispatch";
import OrderPrice from "./OrderPrice";
import ScalarModule from "./Scalar";

export default {
  AdminAPIModule,
  AuthModule,
  CommonModule,
  DeliveryDispatchModule,
  OrderPrice,
  ScalarModule,
};

export const adminVirtualModules = {
  AdminAPIModule,
  ScalarModule,
};
