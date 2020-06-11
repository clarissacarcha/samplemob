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
//@ts-nocheck
require("colors");
const objection_1 = require("objection");
const knex_1 = __importDefault(require("./config/knex"));
objection_1.Model.knex(knex_1.default);
const models_1 = __importDefault(require("./models"));
const { User, Person, Driver } = models_1.default;
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserOne = yield User.query().insert({
            username: "userone",
            password: "password",
            active: 1,
            status: 1,
        });
        const PersonOne = yield Person.query().insert({
            firstName: "One",
            lastName: "Dummy",
            mobileNumber: "09158868833",
            emailAddress: "userone@gmail.com",
            status: 1,
            tokUserId: UserOne.id,
        });
        const DriverOne = yield Driver.query().insert({
            licenseNumber: "LSC1234567890",
            isOnline: true,
            tokUserId: UserOne.id,
        });
        const UserTwo = yield User.query().insert({
            username: "usertwo",
            password: "password",
            active: 1,
            status: 1,
        });
        console.log("DATA IMPORTED".green.inverse);
        process.exit();
    }
    catch (e) {
        console.log(e);
    }
});
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User.query().delete();
        yield Person.query().delete();
        yield Driver.query().delete();
        console.log("DATA DELETED".red.inverse);
        process.exit();
    }
    catch (e) {
        console.log(e);
    }
});
if (process.argv[2] === "-i") {
    importData();
}
else if (process.argv[2] === "-d") {
    deleteData();
}
