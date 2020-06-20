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
        return knex("tok_permissions")
            .del()
            .then(() => {
            // Inserts seed entries
            return knex("tok_permissions").insert([
                //admin permissions
                { id: 1,
                    permission_code: "root_dashboard",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // users
                { id: 2,
                    permission_code: "users_view",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 3,
                    permission_code: "users_create",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 4,
                    permission_code: "users_update",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 5,
                    permission_code: "users_delete",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // operators
                { id: 6,
                    permission_code: "operators_view",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 7,
                    permission_code: "operators_approve",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // drivers
                { id: 8,
                    permission_code: "drivers_view",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 9,
                    permission_code: "drivers_approve",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // vehicles
                { id: 10,
                    permission_code: "vehicles_view",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 11,
                    permission_code: "vehicles_create",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 12,
                    permission_code: "vehicles_update",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 13,
                    permission_code: "vehicles_delete",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // vehicle brands
                { id: 14,
                    permission_code: "vehicle_brands_view",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 15,
                    permission_code: "vehicle_brands_create",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 16,
                    permission_code: "vehicle_brands_update",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 17,
                    permission_code: "vehicle_brands_delete",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // vehicle types
                { id: 18,
                    permission_code: "vehicle_types_view",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 19,
                    permission_code: "vehicle_types_create",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 20,
                    permission_code: "vehicle_types_update",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 21,
                    permission_code: "vehicle_types_delete",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // vehicle models
                { id: 22,
                    permission_code: "vehicle_models_view",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 23,
                    permission_code: "vehicle_models_create",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 24,
                    permission_code: "vehicle_models_update",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 25,
                    permission_code: "vehicle_models_delete",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // credits
                { id: 26,
                    permission_code: "credits_send",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // bills
                { id: 27,
                    permission_code: "bills_view",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 28,
                    permission_code: "bills_create",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 29,
                    permission_code: "bills_update",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 30,
                    permission_code: "bills_delete",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // trips and deliveries
                { id: 31,
                    permission_code: "delivery_history",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 32,
                    permission_code: "trips_history",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                //Operators
                { id: 33,
                    permission_code: "driver_fleet_enroll",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 34,
                    permission_code: "operator_vehicles_enroll",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 35,
                    permission_code: "operator_delivery_history",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 36,
                    permission_code: "operator_trips_history",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 37,
                    permission_code: "operator_reload",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                //Drivers
                { id: 38,
                    permission_code: "driver_reload",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 39,
                    permission_code: "driver_book",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 40,
                    permission_code: "driver_cancel_booking",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 41,
                    permission_code: "driver_trips_history",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 42,
                    permission_code: "driver_delivery_history",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // Customer
                { id: 43,
                    permission_code: "customer_book",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 44,
                    permission_code: "customer_cancel_booking",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 45,
                    permission_code: "customer_trips_history",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                { id: 46,
                    permission_code: "customer_delivery_history",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // ALL
                { id: 47,
                    permission_code: "profile",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // driver
                { id: 48,
                    permission_code: "driver_profile",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                },
                // operator
                { id: 49,
                    permission_code: "operator_profile",
                    description: null,
                    status: 1,
                    created: "0000-00-00 00:00:00",
                    updated: "0000-00-00 00:00:00"
                }
            ]);
        });
    });
}
exports.seed = seed;
