import User from "../models/User";
import moment from "moment";

export default class {
  static generateVerifiedUserId = async () => {
    let verifiedUserId = "";
    let unique = false;

    while (!unique) {
      const nineDigitId = parseInt(moment().valueOf().toString(), 10)
        .toString(32)
        .toUpperCase();
      const userId = `T${nineDigitId}`;

      const result = await User.query().findOne({ userId });

      if (!result) {
        unique = true;
        verifiedUserId = userId;
      }
    }
    return verifiedUserId;
  };
}
