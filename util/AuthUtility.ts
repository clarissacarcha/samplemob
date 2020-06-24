import { AuthTokenModel } from "../rest-models/AuthTokenModel";
import crypto from "crypto";
const bcrypt = require("bcrypt");

export class AuthUtility {
  static verifyAccess = async (token: string) => {
    return await AuthTokenModel.verifyLogin(token);
  };

  static generateHash = (password: string) => {
    const saltRounds = 10;

    return bcrypt.hashSync(password, saltRounds);
  };
  static getUserId = async (token: string) => {
    return await AuthTokenModel.getUserId(token);
  };

  static generateHashAsync = async (password: string) => {
    const saltRounds = 12;

    return await bcrypt.hash(password, saltRounds);
  };

  static verifyHash = async (value: string, hashString: string) => {
    return await bcrypt.compare(value, hashString);
  };
}
