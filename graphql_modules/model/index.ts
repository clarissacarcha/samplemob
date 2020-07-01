//@ts-nocheck
import AddressModule from "./Address";
import AnnouncementModule from "./Announcement";
import CargoTypeModule from "./CargoType";
import ConsumerModule from "./Consumer";
import DeliveryModule from "./Delivery";
import DeliveryLogModule from "./DeliveryLog";
import DriverModule from "./Driver";
import DriverLocationLog from "./DriverLocationLog";
import GlobalSettingModule from "./GlobalSetting";
import NotificationModule from "./Notification";
import PersonModule from "./Person";
import StopModule from "./Stop";
import UserModule from "./User";
import WalletModule from "./Wallet";
import WalletLogModule from "./WalletLog";

export default {
  AddressModule,
  AnnouncementModule,
  CargoTypeModule,
  ConsumerModule,
  DeliveryModule,
  DeliveryLogModule,
  DriverModule,
  DriverLocationLog,
  GlobalSettingModule,
  NotificationModule,
  PersonModule,
  StopModule,
  UserModule,
  WalletModule,
  WalletLogModule,
};

export const adminModelModules = {
  StopModule,
};
