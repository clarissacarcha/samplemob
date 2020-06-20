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
exports.seed = void 0;
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Deletes ALL existing entries
        return knex("tok_user_permissions")
            .del()
            .then(() => {
            // Inserts seed entries
            /*return knex("tok_user_permissions").insert([
              //root web app user
              { id: 1,
                username: "root@gmail.com",
                password: "$2b$10$b44S2p6.oPFcjFx9ODQPOOJO2S2tlkglVXC/aDkBN.jd.4QTsheEe",
                access: "access",
                active: "1",
                failed_login_attempts: "0",
                status: "1",
                created: "2020-06-17 14:07:57",
                updated: "2020-06-17 14:07:57"
              }
            ]);*/
        });
    });
}
exports.seed = seed;
