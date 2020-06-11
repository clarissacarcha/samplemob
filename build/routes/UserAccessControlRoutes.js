"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//initialize router
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//import model
const userAccessControl_1 = require("../controllers/userAccessControl");
const express_validator_1 = require("express-validator");
//router definitions
router.put("/update", [
    express_validator_1.check("id")
        .notEmpty()
        .withMessage("ID is required"),
    express_validator_1.check("roles")
        .notEmpty()
        .isLength({ max: 45 })
        .withMessage("value should not exceed 45 characters"),
    express_validator_1.check("permissions")
        .notEmpty()
        .isLength({ max: 45 })
        .withMessage("value should not exceed 45 characters")
], userAccessControl_1.UserAccessControl.update);
router.post("/list", [
    express_validator_1.check("searchstring")
        .isLength({ max: 45 })
        .withMessage("value should not exceed 45 characters"),
    express_validator_1.check("order")
        .notEmpty()
        .withMessage("Order field is required")
        .isInt({ gt: -1, lt: 7 })
        .withMessage("Filter out of range"),
    express_validator_1.check("dir")
        .notEmpty()
        .withMessage("Order direction is required")
        .isInt({ gt: -1, lt: 2 })
        .withMessage(" valid values, 1 for asc, 0 for desc"),
    express_validator_1.check("limit")
        .notEmpty()
        .withMessage("Limit is required")
        .isInt()
        .withMessage("Only numbers are allowed"),
    express_validator_1.check("offset")
        .notEmpty()
        .withMessage("offset is required")
        .isInt()
        .withMessage("Only numbers are allowed"),
    express_validator_1.check("token")
        .notEmpty()
        .withMessage("Authentication token required")
], userAccessControl_1.UserAccessControl.list);
//export routes
module.exports = router;
