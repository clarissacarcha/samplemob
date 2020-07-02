//@ts-nocheck
//initialize router
import express from "express";
const router = express.Router();
//import model
import { Driver } from "../controllers/driver";

import { check, validationResult } from "express-validator";

//router definitions

router.post(
  "/login",
  [
    check("username")
      .notEmpty()
      .withMessage("Username is required. ")
      .isLength({ max: 45 })
      .withMessage("Username should not exceed 45 characters."),
    check("password").notEmpty().withMessage("Password is required."),
  ],
  Driver.login
);

router.post(
  "/register",
  [
    /*check("accountType")
		  	.isInt({gt:0,lt:4})
		  		.withMessage("Account type is required. "),*/
    check("firstName")
      .notEmpty()
      .withMessage("First name is required. ")
      .isLength({ max: 45 })
      .withMessage("First name cannot exceed 45 characters."),
    check("middleName")
      .isLength({ max: 45 })
      .withMessage("Middle name cannot exceed 45 characters."),
    check("lastName")
      .notEmpty()
      .withMessage("Last name is required. ")
      .isLength({ max: 45 })
      .withMessage("Last name cannot exceed 45 characters."),
    check("mobile_number")
      .notEmpty()
      .withMessage("Mobile number is required. ")
      .isLength({ min: 11, max: 11 })
      .withMessage("Mobile number is up to 11 digits."),
    check("email")
      .notEmpty()
      .withMessage("Email name is required. ")
      .isLength({ max: 100 })
      .withMessage("Email cannot exceed 100 characters. "),
    check("password").notEmpty().withMessage("Password is required. "),
    check("license_number")
      .notEmpty()
      .withMessage("License number is required. ")
      .isLength({ min: 13, max: 20 })
      .withMessage("License number: 13 - 20 characters."),
    check("line_1")
      .notEmpty()
      .withMessage("Line 1 is required. ")
      .isLength({ max: 45 })
      .withMessage("Line 1 cannot exceed 45 characters."),
    check("line_2")
      .isLength({ max: 45 })
      .withMessage("Line 2 cannot exceed 45 characters."),
    check("barangay")
      .notEmpty()
      .withMessage("Barangay is required. ")
      .isLength({ max: 45 })
      .withMessage("Barangay cannot exceed 45 characters."),
    check("city")
      .notEmpty()
      .withMessage("City is required. ")
      .isLength({ max: 45 })
      .withMessage("City cannot exceed 45 characters."),
    check("province")
      .notEmpty()
      .withMessage("Province is required. ")
      .isLength({ max: 45 })
      .withMessage("Province cannot exceed 45 characters."),
    check("country")
      .notEmpty()
      .withMessage("Country is required. ")
      .isLength({ max: 45 })
      .withMessage("Country cannot exceed 45 characters."),
    check("postal_code")
      .isLength({ min: 3, max: 6 })
      .withMessage("Postal code: 3 - 6 characters."),
    check("twoValidIds")
      .notEmpty()
      .withMessage(
        "Two(2) valid ids are required. Including the license number."
      ),
  ],
  Driver.register
);
router.get(
  "/getGeneralInfo/:token",
  [check("token").notEmpty().withMessage("Token is required. ")],
  Driver.getGeneralInfo
);

router.get(
  "/checkDriverAuthToken/:token",
  [check("token").notEmpty().withMessage("Token is required. ")],
  Driver.checkDriverAuthToken
);
router.post("/getDeliveryHistory", [], Driver.getDeliveryHistory);
/// code block below to be removed. Only being used fot testing

router.get("/hash", Driver.hash);

//export routes
module.exports = router;
