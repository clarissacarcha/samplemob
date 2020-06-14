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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const usermodel_1 = require("../rest-models/usermodel");
const AuthTokenModel_1 = require("../rest-models/AuthTokenModel");
const express_validator_1 = require("express-validator");
const crypto_1 = __importDefault(require("crypto"));
const ServerResponse_1 = require("../interfaces/ServerResponse");
const dateFormat = require('dateformat');
const bcrypt = require('bcrypt');
const PersonModel_1 = require("../rest-models/PersonModel");
const CustomerModel_1 = require("../rest-models/CustomerModel");
class User {
}
exports.User = User;
User.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let status = 200;
    let user_data = {};
    //validate input
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        status = 401;
        return res.status(200).json(new ServerResponse_1.ServerResponse(status, {
            message: errors.array()
        }).sendResponse());
    }
    let user = yield usermodel_1.UserModel.readFromUserName(req.body.username);
    let message = "";
    //user exists and is active
    if (user.length > 0) {
        //validate password
        const match = yield bcrypt.compare(req.body.password, user[0].password);
        if (match) {
            //create a token and send it to the client
            const date = dateFormat(new Date(), "yyyymmddhMMss");
            const sourceString = date + user[0].id;
            const token = crypto_1.default.createHash('sha256').update(sourceString).digest('hex');
            const roles = yield usermodel_1.UserModel.getUserRoles(user[0].id);
            const permissions = yield usermodel_1.UserModel.getUserPermissions(user[0].id);
            yield AuthTokenModel_1.AuthTokenModel.create(token, user[0].id, JSON.stringify(roles), JSON.stringify(permissions));
            status = 200;
            message = "Login successful";
            user_data = {
                token: token,
                name: user[0].name,
                avatar: user[0].avatar,
                roles: roles,
                permissions: permissions
            };
        }
        else {
            status = 401;
            message = "Username and password did not match.";
        }
    }
    else {
        status = 401;
        message = "Username and password did not match.";
    }
    res.status(200).json(new ServerResponse_1.ServerResponse(status, {
        message: [{ msg: message }],
        user_data: user_data
    }).sendResponse());
});
User.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let status = 200;
    let user_data = {};
    //validate input
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        status = 422;
        return res.status(200).json(new ServerResponse_1.ServerResponse(status, {
            message: errors.array()
        }).sendResponse());
    }
    // check if user already exists
    let user = yield usermodel_1.UserModel.readFromUserName(req.body.email);
    let message = "";
    let createdUserId = "";
    let token = "";
    const tempAvatar = "../assets/img/avatarplaceholder.png";
    const fullName = req.body.firstName + " " + req.body.middleName + " " + req.body.lastName;
    if (user.length > 0) {
        status = 422;
        message = req.body.email + " is already taken.";
    }
    // if not, create the user, log it in and return token
    else {
        createdUserId = yield usermodel_1.UserModel.create(req.body);
        message = "User created";
        req.body.userId = createdUserId;
        //create person record
        PersonModel_1.PersonModel.create(req.body);
        //create a consumer record
        CustomerModel_1.CustomerModel.create(req.body);
        //create a token and send it to the client
        const date = dateFormat(new Date(), "yyyymmddhMMss");
        const sourceString = date + createdUserId;
        token = crypto_1.default.createHash('sha256').update(sourceString).digest('hex');
        const roles = yield usermodel_1.UserModel.getUserRoles(createdUserId);
        const permissions = yield usermodel_1.UserModel.getUserPermissions(createdUserId);
        yield AuthTokenModel_1.AuthTokenModel.create(token, createdUserId, JSON.stringify(roles), JSON.stringify(permissions));
        user_data = {
            token: token,
            name: fullName,
            avatar: tempAvatar,
            roles: roles,
            permissions: permissions
        };
        status = 200;
    }
    res.status(200).json(new ServerResponse_1.ServerResponse(status, {
        message: [{ msg: message }],
        user_data: user_data
    }).sendResponse());
});
/// code block below to be removed. Only being used fot testing
User.hash = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const myPlaintextPassword = 'rexdiamante';
    /* bcrypt.genSalt(saltRounds, function(err:any, salt:any) {
     bcrypt.hash(myPlaintextPassword, salt, function(err:any, hash:any) {
           res.send(hash);
     });*/
    /*const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(myPlaintextPassword, salt);*/
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    const match = yield bcrypt.compare(myPlaintextPassword, hash);
    if (match) {
        res.send("matched" + hash);
    }
    else {
        res.send("not matched");
    }
});
