//@ts-nocheck
import { UserAccessControlModel } from "../rest-models/UserAccessControlModel";

import { AuthUtility } from "../util/AuthUtility";

import { check, validationResult } from "express-validator";

export class UserAccessControl {
  static update = async (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let result = await UserAccessControlModel.update(req.body);

    res.status(200).json({
      result,
    });
  };

  static list = async (req: any, res: any, next: any) => {
    //varify access

    let ress = await AuthUtility.verifyAccess(req.body.token);

    if (ress) {
      //validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let result = await UserAccessControlModel.list(req.body);

      res.status(200).json({
        result,
      });
    } else {
      let result = {
        authError: 1,
        message: "You are not logged in",
      };
      res.status(200).json({
        result,
      });
    }
  };
}
