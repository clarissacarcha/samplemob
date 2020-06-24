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
        return knex("tok_persons")
            .del()
            .then(() => {
            // Inserts seed entries
            return knex("tok_persons").insert([
                //root web app user
                {
                    id: 1,
                    first_name: "Root",
                    middle_name: "",
                    last_name: "User",
                    mobile_number: null,
                    birthdate: null,
                    gender: null,
                    avatar: "avatarplaceholder.png",
                    status: "1",
                    created_at: knex.fn.now(),
                    updated_at: knex.fn.now(),
                    tok_user_id: "1",
                    tok_address_id: null,
                },
            ]);
        });
    });
}
exports.seed = seed;
