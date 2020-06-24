//@ts-nocheck
import { AccountLevelTypeModel } from "../rest-models/AccountLevelTypeModel";

import { AuthUtility } from "../util/AuthUtility";

import { check, validationResult } from "express-validator";

import { ServerResponse } from "../interfaces/ServerResponse";

export class AccountLevelType {
  static create = async (req: any, res: any, next: any) => {
    let status = 200;

    //validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      status = 422;
      return res.status(200).json(
        new ServerResponse(status, {
          errors: errors.array(),
        }).sendResponse()
      );
    }

    let result = await AccountLevelTypeModel.create(req.body);

    res.status(200).json(
      new ServerResponse(status, {
        result,
      }).sendResponse()
    );
  };

  static read = async (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let result = await AccountLevelTypeModel.read(req.params.id);

    res.status(200).json({
      result,
    });
  };

  static update = async (req: any, res: any, next: any) => {
    let status = 200;

    //validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      status = 422;
      return res.status(200).json(
        new ServerResponse(status, {
          errors: errors.array(),
        }).sendResponse()
      );
    }
    let result = await AccountLevelTypeModel.update(req.body);

    res.status(200).json(
      new ServerResponse(status, {
        result,
      }).sendResponse()
    );
  };

  static delete = async (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let result = await AccountLevelTypeModel.delete(req.params.id);

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

      let result = await AccountLevelTypeModel.list(req.body);

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
