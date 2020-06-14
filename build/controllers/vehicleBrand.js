"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleBrand = void 0;
const VehicleBrandModel_1 = require("../rest-models/VehicleBrandModel");
const AuthUtility_1 = require("../util/AuthUtility");
const express_validator_1 = require("express-validator");
class VehicleBrand {
}
exports.VehicleBrand = VehicleBrand;
VehicleBrand.create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //validate input
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let result = yield VehicleBrandModel_1.VehicleBrandModel.create(req.body);
    res.status(200).json({
        result
    });
});
VehicleBrand.read = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let result = yield VehicleBrandModel_1.VehicleBrandModel.read(req.params.id);
    res.status(200).json({
        result
    });
});
VehicleBrand.update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let result = yield VehicleBrandModel_1.VehicleBrandModel.update(req.body);
    res.status(200).json({
        result
    });
});
VehicleBrand.delete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let result = yield VehicleBrandModel_1.VehicleBrandModel.delete(req.params.id);
    res.status(200).json({
        result
    });
});
VehicleBrand.list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //varify access
    let ress = yield AuthUtility_1.AuthUtility.verifyAccess(req.body.token);
    if (ress) {
        //validate input
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let result = yield VehicleBrandModel_1.VehicleBrandModel.list(req.body);
        res.status(200).json({
            result
        });
    }
    else {
        let result = {
            authError: 1,
            message: "You are not logged in"
        };
        res.status(200).json({
            result
        });
    }
});
