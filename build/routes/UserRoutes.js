"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//initialize router
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//import model
const user_1 = require("../controllers/user");
const express_validator_1 = require("express-validator");
//router definitions
router.post("/login", [
    express_validator_1.check("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ max: 45 })
        .withMessage("username should not exceed 45 characters"),
    express_validator_1.check("password")
        .notEmpty()
        .withMessage("Password is required")
], user_1.User.login);
router.post("/register", [
    express_validator_1.check("accountType")
        .notEmpty()
        .withMessage("Accout type is required")
        .isInt({ gt: 0, lt: 4 })
        .withMessage("Account type is required"),
    express_validator_1.check("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ max: 45 })
        .withMessage("Firstname cannot exceed 45 characters"),
    express_validator_1.check("middleName")
        .isLength({ max: 45 })
        .withMessage("Middle name cannot exceed 45 characters"),
    express_validator_1.check("lastName")
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ max: 45 })
        .withMessage("Lastname cannot exceed 45 characters"),
    express_validator_1.check("email")
        .notEmpty()
        .withMessage("Email name is required")
        .isLength({ max: 100 })
        .withMessage("Email cannot exceed 100 characters"),
    express_validator_1.check("password")
        .notEmpty()
        .withMessage("Password is required")
], user_1.User.register);
/// code block below to be removed. Only being used fot testing
router.get("/hash", user_1.User.hash);
//export routes
module.exports = router;
