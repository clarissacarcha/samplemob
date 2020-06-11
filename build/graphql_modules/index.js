"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
// Constains all modules that are representations of models
const model_1 = __importDefault(require("./model/"));
// Constains all modules not present in databse
const virtual_1 = __importDefault(require("./virtual"));
exports.default = Object.assign(Object.assign({}, model_1.default), virtual_1.default);
