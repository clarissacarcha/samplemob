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
//@ts-nocheck
const apollo_server_express_1 = require("apollo-server-express");
const FileUploadS3_1 = __importDefault(require("../../util/FileUploadS3"));
const NotificationUtility_1 = __importDefault(require("../../util/NotificationUtility"));
const DeliveryLog_1 = __importDefault(require("./DeliveryLog"));
const Driver_1 = __importDefault(require("./Driver"));
const Stop_1 = __importDefault(require("./Stop"));
const Scalar_1 = __importDefault(require("../virtual/Scalar"));
const models_1 = __importDefault(require("../../models"));
const { Delivery, DeliveryLog, Stop, Driver, Consumer } = models_1.default;
const typeDefs = apollo_server_express_1.gql `
  type Delivery {
    id: String
    tokConsumerId: String
    distance: String
    duration: String
    price: String
    notes: String
    cargo: String
    status: Int
    createdAt: DateTime
    tokDriverId: String
    senderTokStopId: String
    recipientTokStopId: String
    senderStop: Stop
    recipientStop: Stop
    logs: [DeliveryLog]
    driver: Driver
  }

  type StatusCount {
    status: Int
    count: Int
  }

  input deliveryFilter {
    tokConsumerId: String
    tokDriverId: String
    status: Int
    statusIn: [Int]
  }

  input PostDeliveryInput {
    tokConsumerId: String
    distance: Float
    duration: Float
    price: String
    senderStop: StopInput
    recipientStop: [StopInput]
  }

  input PatchDeliveryAcceptedInput {
    deliveryId: String!
    driverId: String!
  }

  input PatchDeliveryCancelInput {
    deliveryId: String!
  }

  input PatchDeliveryDeleteInput {
    deliveryId: String!
  }

  input PatchDeliveryRebookInput {
    deliveryId: String!
  }

  input PatchDeliveryIncrementStatusInput {
    deliveryId: String!
    file: Upload
  }

  type Query {
    getDeliveries(filter: deliveryFilter): [Delivery]
    getDeliveriesCountByStatus(filter: deliveryFilter): [StatusCount]
  }

  type Mutation {
    postDelivery(input: PostDeliveryInput): String
    patchDeliveryAccepted(input: PatchDeliveryAcceptedInput!): String
    patchDeliveryCancel(input: PatchDeliveryCancelInput!): Delivery
    patchDeliveryDelete(input: PatchDeliveryDeleteInput!): String
    patchDeliveryRebook(input: PatchDeliveryRebookInput!): String
    patchDeliveryIncrementStatus(
      input: PatchDeliveryIncrementStatusInput!
    ): Delivery
  }
`;
const resolvers = {
    Delivery: {
        senderStop: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield Stop.query().findOne({
                id: parent.senderTokStopId,
            });
        }),
        recipientStop: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield Stop.query().findOne({
                id: parent.recipientTokStopId,
            });
        }),
        logs: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield DeliveryLog.query().where({
                tokDeliveryId: parent.id,
            });
        }),
        driver: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield Driver.query().findOne({
                id: parent.tokDriverId,
            });
            return res;
        }),
    },
    Query: {
        getDeliveries: (_, { filter = {} }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { tokConsumerId, tokDriverId, status, statusIn } = filter;
                const result = yield Delivery.query().modify((builder) => {
                    // Filter by tokConsumerId
                    if (tokConsumerId) {
                        builder.where({ tokConsumerId });
                    }
                    // Filter by tokConsumerId
                    // Compare to undefined as status = 0 would produce a falsy value
                    if (status !== undefined) {
                        builder.where({ status });
                    }
                    // Filter by tokDriverId
                    if (tokDriverId) {
                        builder.where({ tokDriverId });
                    }
                    // Filter by status in array
                    if (statusIn) {
                        builder.whereIn("status", statusIn);
                    }
                    // Order by createdAt DESC
                    builder.orderBy("createdAt", "DESC");
                });
                return result;
            }
            catch (e) {
                throw e;
            }
        }),
        getDeliveriesCountByStatus: (_, { filter = {} }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { tokConsumerId } = filter;
                const result = yield Delivery.query()
                    .select("status")
                    .count("status as count")
                    .modify((builder) => {
                    // Filter by tokConsumerId
                    if (tokConsumerId) {
                        builder.where({ tokConsumerId });
                    }
                })
                    .groupBy("status");
                return result;
            }
            catch (e) {
                throw e;
            }
        }),
    },
    Mutation: {
        postDelivery: (_, { input }, { Models }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Insert a delivery record for each recipient.
                yield Promise.all(input.recipientStop.map((item, index) => __awaiter(void 0, void 0, void 0, function* () {
                    const notes = input.recipientStop[index].notes; // save recipient notes before being deleted
                    const cargo = input.recipientStop[index].cargo;
                    delete input.recipientStop[index].notes; //remove recipient notes. Notes is under Delivery, not Stop
                    delete input.recipientStop[index].cargo;
                    // Create delivery record
                    const insertedDelivery = yield Delivery.query().insertGraph(Object.assign(Object.assign({}, input), { recipientStop: input.recipientStop[index], notes,
                        cargo, status: 1 }));
                    // Create delivery log with status = 1 || Order Placed
                    yield DeliveryLog.query().insert({
                        status: 1,
                        tokDeliveryId: insertedDelivery.id,
                        createdAt: insertedDelivery.createdAt,
                    });
                })));
                return "Delivery Posted";
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        }),
        // Driver accepts a delivery order
        patchDeliveryAccepted: (_, { input }, { Models }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Find the delivery record using input.deliveryId
                const delivery = yield Delivery.query().findById(input.deliveryId);
                // Throw error if delivery record does not exist
                if (!delivery) {
                    throw new apollo_server_express_1.UserInputError("Delivery record does not exist.");
                }
                // Update delivery record and set driverId
                // Also update status = 2 | Delivery Scheduled
                // TODO: Get driverId from authentication header
                yield Delivery.query()
                    .findById(input.deliveryId)
                    .patch({ tokDriverId: input.driverId, status: 2 });
                // Create delivery log with status = 2
                yield DeliveryLog.query().insert({
                    status: 2,
                    tokDeliveryId: input.deliveryId,
                });
                const consumer = yield Consumer.query().findOne({
                    id: delivery.tokConsumerId,
                });
                NotificationUtility_1.default.notifyUser({
                    userId: consumer.tokUserId,
                    deliveryId: delivery.id,
                    deliveryStatus: 2,
                });
                return "Delivery successfully accepted.";
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        }),
        // Driver updates the status of a delivery order
        patchDeliveryIncrementStatus: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Find the delivery record.
                let delivery = yield Delivery.query().findById(input.deliveryId);
                // Throw error if delivery does not exist
                if (!delivery) {
                    throw new apollo_server_express_1.UserInputError("Delivery record does not exist.");
                }
                // Throw error if status not in [2,3,4,5]
                if (![2, 3, 4, 5].includes(delivery.status)) {
                    throw new apollo_server_express_1.UserInputError("Delivery status is invalid.");
                }
                // Update/Increment the delivery status
                yield Delivery.query()
                    .findById(input.deliveryId)
                    .increment("status", 1);
                let uploadedFile;
                if (input.file) {
                    uploadedFile = yield FileUploadS3_1.default({
                        file: input.file,
                        folder: "toktok/",
                    });
                }
                // Create delivery log with status incremented status
                yield DeliveryLog.query().insert(Object.assign({ status: delivery.status + 1, tokDeliveryId: input.deliveryId }, (input.file ? { image: uploadedFile.filename } : {})));
                const consumer = yield Consumer.query().findOne({
                    id: delivery.tokConsumerId,
                });
                NotificationUtility_1.default.notifyUser({
                    userId: consumer.tokUserId,
                    deliveryId: delivery.id,
                    deliveryStatus: delivery.status + 1,
                });
                // Return the delivery record
                return yield Delivery.query().findById(input.deliveryId);
            }
            catch (e) {
                throw e;
            }
        }),
        // Customer cancels a delivery order
        patchDeliveryCancel: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Find the delivery record using input.deliveryId
                const delivery = yield Delivery.query().findById(input.deliveryId);
                // Throw error if delivery record does not exist
                if (!delivery) {
                    throw new apollo_server_express_1.UserInputError("Delivery record does not exist.");
                }
                // Update delivery status to 7 - Cancelled
                yield Delivery.query().findById(input.deliveryId).patch({ status: 7 });
                // Create delivery log with status = 7
                yield DeliveryLog.query().insert({
                    status: 7,
                    tokDeliveryId: input.deliveryId,
                });
                return yield Delivery.query().findById(input.deliveryId);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        }),
        // Customer deletes a delivery order
        patchDeliveryDelete: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Find the delivery record using input.deliveryId
                const delivery = yield Delivery.query().findById(input.deliveryId);
                // Throw error if delivery record does not exist
                if (!delivery) {
                    throw new apollo_server_express_1.UserInputError("Delivery record does not exist.");
                }
                // Update delivery status to 8 - Deleted
                yield Delivery.query().findById(input.deliveryId).patch({ status: 8 });
                // Create delivery log with status = 8
                yield DeliveryLog.query().insert({
                    status: 8,
                    tokDeliveryId: input.deliveryId,
                });
                return "Order successfully deleted.";
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        }),
        // Customer rebooks a delivery order
        patchDeliveryRebook: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Find the delivery record using input.deliveryId
                const delivery = yield Delivery.query()
                    .findById(input.deliveryId)
                    .withGraphFetched({
                    senderStop: true,
                    recipientStop: true,
                });
                // Throw error if delivery record does not exist
                if (!delivery) {
                    throw new apollo_server_express_1.UserInputError("Delivery record does not exist.");
                }
                const { tokConsumerId, distance, duration, price, senderStop, recipientStop, notes, } = delivery;
                delete senderStop.id;
                delete recipientStop.id;
                // Create delivery record
                const insertedDelivery = yield Delivery.query().insertGraph({
                    tokConsumerId,
                    distance,
                    duration,
                    price,
                    senderStop,
                    recipientStop,
                    notes,
                    status: 1,
                });
                // Create delivery log with status = 1 || Order Placed
                yield DeliveryLog.query().insert({
                    status: 1,
                    tokDeliveryId: insertedDelivery.id,
                    createdAt: insertedDelivery.createdAt,
                });
                return "Delivery successfully booked.";
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        }),
    },
};
const core_1 = require("@graphql-modules/core");
exports.default = new core_1.GraphQLModule({
    imports: [DeliveryLog_1.default, Scalar_1.default, Stop_1.default, Driver_1.default],
    typeDefs,
    resolvers,
});
// // Filter by tokConsumerId
// if (tokConsumerId) {
//   builder.where({ tokConsumerId });
// }
// // Filter by tokDriverId
// if (tokDriverId) {
//   builder.where({ tokDriverId });
// }
// // Filter by status in array
// if (statusIn) {
//   builder.whereIn("status", [1]);
// }
