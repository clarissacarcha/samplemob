//@ts-nocheck
import express from "express";
const router = express.Router();
import { VehicleType } from "../controllers/vehicleType";

router.get("/sample", VehicleType.create);

module.exports = router;
