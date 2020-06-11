"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//initialize router
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//import model
const vehicleModel_1 = require("../controllers/vehicleModel");
const express_validator_1 = require("express-validator");
//router definitions
router.post("/create", [
    express_validator_1.check("model")
        .notEmpty()
        .isLength({ max: 45 })
        .withMessage("value should not exceed 45 characters"),
    express_validator_1.check("model_year")
        .notEmpty()
        .withMessage("This field is required")
        .isInt({ gt: -1, lt: 10000 })
        .withMessage("valid value: 1 - 9999")
], vehicleModel_1.VehicleModel.create);
router.get("/read/:id", [
    express_validator_1.check('id')
        .notEmpty()
        .withMessage("ID is required")
        .isInt()
        .withMessage("Only number are allowed")
], vehicleModel_1.VehicleModel.read);
router.put("/update", [
    express_validator_1.check("id")
        .notEmpty()
        .withMessage("ID is required"),
    express_validator_1.check("model")
        .notEmpty()
        .isLength({ max: 45 })
        .withMessage("value should not exceed 45 characters"),
    express_validator_1.check("model_year")
        .notEmpty()
        .withMessage("This field is required")
        .isInt({ gt: -1, lt: 10000 })
        .withMessage("valid value: 0 - 9999")
], vehicleModel_1.VehicleModel.update);
router.delete("/delete/:id", [
    express_validator_1.check('id')
        .notEmpty()
        .withMessage("ID is required")
        .isInt()
        .withMessage("Only number are allowed")
], vehicleModel_1.VehicleModel.delete);
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
], vehicleModel_1.VehicleModel.list);
//export routes
module.exports = router;
