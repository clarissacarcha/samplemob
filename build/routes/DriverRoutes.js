"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//initialize router
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//import model
const driver_1 = require("../controllers/driver");
const express_validator_1 = require("express-validator");
//router definitions
router.post("/login", [
    express_validator_1.check("username")
        .notEmpty()
        .withMessage("Username is required. ")
        .isLength({ max: 45 })
        .withMessage("Username should not exceed 45 characters."),
    express_validator_1.check("password")
        .notEmpty()
        .withMessage("Password is required.")
], driver_1.Driver.login);
router.post("/register", [
    /*check("accountType")
      .isInt({gt:0,lt:4})
          .withMessage("Account type is required. "),*/
    express_validator_1.check("firstName")
        .notEmpty()
        .withMessage("First name is required. ")
        .isLength({ max: 45 })
        .withMessage("First name cannot exceed 45 characters."),
    express_validator_1.check("middleName")
        .isLength({ max: 45 })
        .withMessage("Middle name cannot exceed 45 characters."),
    express_validator_1.check("lastName")
        .notEmpty()
        .withMessage("Last name is required. ")
        .isLength({ max: 45 })
        .withMessage("Last name cannot exceed 45 characters."),
    express_validator_1.check("mobile_number")
        .notEmpty()
        .withMessage("Mobile number is required. ")
        .isLength({ min: 11, max: 11 })
        .withMessage("Mobile number is up to 11 digits."),
    express_validator_1.check("email")
        .notEmpty()
        .withMessage("Email name is required. ")
        .isLength({ max: 100 })
        .withMessage("Email cannot exceed 100 characters. "),
    express_validator_1.check("password")
        .notEmpty()
        .withMessage("Password is required. "),
    express_validator_1.check("license_number")
        .notEmpty()
        .withMessage("License number is required. ")
        .isLength({ min: 13, max: 20 })
        .withMessage("License number: 13 - 20 characters."),
    express_validator_1.check("line_1")
        .notEmpty()
        .withMessage("Line 1 is required. ")
        .isLength({ max: 45 })
        .withMessage("Line 1 cannot exceed 45 characters."),
    express_validator_1.check("line_2")
        .isLength({ max: 45 })
        .withMessage("Line 2 cannot exceed 45 characters."),
    express_validator_1.check("barangay")
        .notEmpty()
        .withMessage("Barangay is required. ")
        .isLength({ max: 45 })
        .withMessage("Barangay cannot exceed 45 characters."),
    express_validator_1.check("city")
        .notEmpty()
        .withMessage("City is required. ")
        .isLength({ max: 45 })
        .withMessage("City cannot exceed 45 characters."),
    express_validator_1.check("province")
        .notEmpty()
        .withMessage("Province is required. ")
        .isLength({ max: 45 })
        .withMessage("Province cannot exceed 45 characters."),
    express_validator_1.check("country")
        .notEmpty()
        .withMessage("Country is required. ")
        .isLength({ max: 45 })
        .withMessage("Country cannot exceed 45 characters."),
    express_validator_1.check("postal_code")
        .isLength({ min: 3, max: 6 })
        .withMessage("Postal code: 3 - 6 characters."),
    express_validator_1.check("twoValidIds")
        .notEmpty()
        .withMessage("Two(2) valid ids are required. Including the license number."),
], driver_1.Driver.register);
router.get("/getGeneralInfo/:token", [
    express_validator_1.check("token")
        .notEmpty()
        .withMessage("Token is required. ")
], driver_1.Driver.getGeneralInfo);
router.get("/checkDriverAuthToken/:token", [
    express_validator_1.check("token")
        .notEmpty()
        .withMessage("Token is required. ")
], driver_1.Driver.checkDriverAuthToken);
router.post("/getDeliveryHistory", [], driver_1.Driver.getDeliveryHistory);
/// code block below to be removed. Only being used fot testing
router.get("/hash", driver_1.Driver.hash);
//export routes
module.exports = router;
