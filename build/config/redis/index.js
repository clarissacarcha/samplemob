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
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
redis.on("error", function (err) {
    console.log("REDIS ERROR: " + err);
});
// Used to store 6 digit verification code for registration and login
exports.REDIS_LOGIN_REGISTER = () => {
    redis.select(1);
    return redis;
};
exports.TEST = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.REDIS_LOGIN_REGISTER().set("key", "REGISTER", "EX", "120");
        let keyValue = yield exports.REDIS_LOGIN_REGISTER().get("key");
        console.log("REDIS:", keyValue);
        yield exports.REDIS_LOGIN_REGISTER().del("key");
        keyValue = yield exports.REDIS_LOGIN_REGISTER().get("key");
        console.log("REDIS:", keyValue);
    }
    catch (error) {
        console.log(error);
    }
});
