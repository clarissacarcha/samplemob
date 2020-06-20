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
exports.Role = void 0;
const RoleModel_1 = require("../rest-models/RoleModel");
const AuthUtility_1 = require("../util/AuthUtility");
const express_validator_1 = require("express-validator");
const ServerResponse_1 = require("../interfaces/ServerResponse");
class Role {
}
exports.Role = Role;
Role.create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let status = 200;
    //validate input
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        status = 422;
        return res.status(200).json(new ServerResponse_1.ServerResponse(status, {
            errors: errors.array()
        }).sendResponse());
    }
    let result = yield RoleModel_1.RoleModel.create(req.body);
    res.status(200).json(new ServerResponse_1.ServerResponse(status, {
        result
    }).sendResponse());
});
Role.read = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let result = yield RoleModel_1.RoleModel.read(req.params.id);
    res.status(200).json({
        result
    });
});
Role.update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let status = 200;
    //validate input
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        status = 422;
        return res.status(200).json(new ServerResponse_1.ServerResponse(status, {
            errors: errors.array()
        }).sendResponse());
    }
    let result = yield RoleModel_1.RoleModel.update(req.body);
    res.status(200).json(new ServerResponse_1.ServerResponse(status, {
        result
    }).sendResponse());
});
Role.delete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let result = yield RoleModel_1.RoleModel.delete(req.params.id);
    res.status(200).json({
        result
    });
});
Role.list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //varify access
    let ress = yield AuthUtility_1.AuthUtility.verifyAccess(req.body.token);
    if (ress) {
        //validate input
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let result = yield RoleModel_1.RoleModel.list(req.body);
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
Role.getRolePermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let result = yield RoleModel_1.RoleModel.getRolePermissions(req.params.role);
    res.status(200).json({
        result
    });
});
