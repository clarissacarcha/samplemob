"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const Address_1 = __importDefault(require("./Address"));
const Announcement_1 = __importDefault(require("./Announcement"));
const Consumer_1 = __importDefault(require("./Consumer"));
const Delivery_1 = __importDefault(require("./Delivery"));
const DeliveryLog_1 = __importDefault(require("./DeliveryLog"));
const Driver_1 = __importDefault(require("./Driver"));
const GlobalSetting_1 = __importDefault(require("./GlobalSetting"));
const Notification_1 = __importDefault(require("./Notification"));
const Person_1 = __importDefault(require("./Person"));
const Stop_1 = __importDefault(require("./Stop"));
const User_1 = __importDefault(require("./User"));
const Wallet_1 = __importDefault(require("./Wallet"));
const WalletLog_1 = __importDefault(require("./WalletLog"));
exports.default = {
    AddressModule: Address_1.default,
    AnnouncementModule: Announcement_1.default,
    ConsumerModule: Consumer_1.default,
    DeliveryModule: Delivery_1.default,
    DeliveryLogModule: DeliveryLog_1.default,
    DriverModule: Driver_1.default,
    GlobalSettingModule: GlobalSetting_1.default,
    NotificationModule: Notification_1.default,
    PersonModule: Person_1.default,
    StopModule: Stop_1.default,
    UserModule: User_1.default,
    WalletModule: Wallet_1.default,
    WalletLogModule: WalletLog_1.default,
};
