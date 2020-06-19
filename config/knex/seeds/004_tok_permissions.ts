import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
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
        // Operators, admin and Drivers
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
        
        //Operators and Drivers
        { id: 35,
          permission_code: "reload",
          description: null,
          status: 1,
          created: "0000-00-00 00:00:00",
          updated: "0000-00-00 00:00:00"
        },

        { id: 36,
          permission_code: "book",
          description: null,
          status: 1,
          created: "0000-00-00 00:00:00",
          updated: "0000-00-00 00:00:00"
        },

        { id: 37,
          permission_code: "cancel_booking",
          description: null,
          status: 1,
          created: "0000-00-00 00:00:00",
          updated: "0000-00-00 00:00:00"
        }



      ]);
    });
}
