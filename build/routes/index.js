"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const vehicleType_1 = require("../controllers/vehicleType");
router.get('/sample', vehicleType_1.VehicleType.create);
module.exports = router;
