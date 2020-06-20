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
        return knex("tok_roles")
            .del()
            .then(() => {
            // Inserts seed entries
            return knex("tok_roles").insert([
                //root web app user
                { id: 1,
                    role: "Root",
                    status: "1",
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 2,
                    role: "Driver",
                    status: "1",
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 3,
                    role: "Operator",
                    status: "1",
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 4,
                    role: "Regular",
                    status: "1",
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                }
            ]);
        });
    });
}
exports.seed = seed;
