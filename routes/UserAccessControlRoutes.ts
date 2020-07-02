//@ts-nocheck
//initialize router
import express from "express";
const router = express.Router();
//import model
import { UserAccessControl } from "../controllers/userAccessControl";

import { check, validationResult } from "express-validator";

//router definitions

router.put(
  "/update",
  [
    check("id").notEmpty().withMessage("ID is required"),
    check("roles")
      .notEmpty()
      .isLength({ max: 45 })
      .withMessage("value should not exceed 45 characters"),
    check("permissions")
      .notEmpty()
      .isLength({ max: 45 })
      .withMessage("value should not exceed 45 characters"),
  ],
  UserAccessControl.update
);

router.post(
  "/list",
  [
    check("searchstring")
      .isLength({ max: 45 })
      .withMessage("value should not exceed 45 characters"),
    check("order")
      .notEmpty()
      .withMessage("Order field is required")
      .isInt({ gt: -1, lt: 7 })
      .withMessage("Filter out of range"),
    check("dir")
      .notEmpty()
      .withMessage("Order direction is required")
      .isInt({ gt: -1, lt: 2 })
      .withMessage(" valid values, 1 for asc, 0 for desc"),
    check("limit")
      .notEmpty()
      .withMessage("Limit is required")
      .isInt()
      .withMessage("Only numbers are allowed"),
    check("offset")
      .notEmpty()
      .withMessage("offset is required")
      .isInt()
      .withMessage("Only numbers are allowed"),
    check("token").notEmpty().withMessage("Authentication token required"),
  ],
  UserAccessControl.list
);
//export routes
module.exports = router;
