"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//initialize router
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//import model
const vehicleType_1 = require("../controllers/vehicleType");
const express_validator_1 = require("express-validator");
//router definitions
router.post("/create", [
    express_validator_1.check("type")
        .notEmpty()
        .withMessage("This field is required. ")
        .isLength({ max: 45 })
        .withMessage("Value should not exceed 45 characters."),
    express_validator_1.check("seats")
        .notEmpty()
        .withMessage("This field is required. ")
        .isInt({ gt: -1, lt: 101 })
        .withMessage("Valid value: 1 - 100."),
    express_validator_1.check("cargo_capacity")
        .notEmpty()
        .withMessage("This field is required. ")
        .isInt({ gt: -1, lt: 101 })
        .withMessage("Valid value: 1 - 100."),
    express_validator_1.check("cargo_unit")
        .notEmpty()
        .withMessage("This field is required. ")
        .isLength({ max: 45 })
        .withMessage("Must not exceed 45 characters. ")
], vehicleType_1.VehicleType.create);
router.get("/read/:id", [
    express_validator_1.check('id')
        .notEmpty()
        .withMessage("ID is required")
        .isInt()
        .withMessage("Only number are allowed")
], vehicleType_1.VehicleType.read);
router.put("/update", [
    express_validator_1.check("id")
        .notEmpty()
        .withMessage("ID is required. "),
    express_validator_1.check("type")
        .notEmpty()
        .withMessage("This field is required. ")
        .isLength({ max: 45 })
        .withMessage("Value should not exceed 45 characters."),
    express_validator_1.check("seats")
        .notEmpty()
        .withMessage("This field is required. ")
        .isInt({ gt: -1, lt: 101 })
        .withMessage("Valid value: 1 - 100. "),
    express_validator_1.check("cargo_capacity")
        .notEmpty()
        .withMessage("This field is required. ")
        .isInt({ gt: -1, lt: 101 })
        .withMessage("Valid value: 1 - 100. "),
    express_validator_1.check("cargo_unit")
        .notEmpty()
        .withMessage("This field is required. ")
        .isLength({ max: 45 })
        .withMessage("Must not exceed 45 characters.")
], vehicleType_1.VehicleType.update);
router.delete("/delete/:id", [
    express_validator_1.check('id')
        .notEmpty()
        .withMessage("ID is required")
        .isInt()
        .withMessage("Only number are allowed")
], vehicleType_1.VehicleType.delete);
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
], vehicleType_1.VehicleType.list);
//export routes
module.exports = router;
