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
Object.defineProperty(exports, "__esModule", { value: true });
const AuthTokenModel_1 = require("../rest-models/AuthTokenModel");
const bcrypt = require('bcrypt');
class AuthUtility {
}
exports.AuthUtility = AuthUtility;
AuthUtility.verifyAccess = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield AuthTokenModel_1.AuthTokenModel.verifyLogin(token);
});
AuthUtility.generateHash = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
};
