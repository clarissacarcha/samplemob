"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const { Driver, User, Person, Delivery } = models_1.default;
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await User.query()
    //   .findOne({
    //     username: "9667682812",
    //   })
    //   .withGraphFetched({
    //     driver: true,
    //     person: true,
    //     consumer: true,
    //   });
    // console.log(JSON.stringify(result, null, 4));
    // const hsh = await AuthUtility.generateHashAsync("123456");
    // console.log(hsh);
    // OneSignalUtility.pushToUserId({
    //   userId: "2",
    //   title: "Welcome to toktok",
    //   body: "Kamusta mga ka-toktok",
    // });
});
