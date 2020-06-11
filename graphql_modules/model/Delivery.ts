//@ts-nocheck
import { gql, UserInputError } from "apollo-server-express";
import fileUploadS3 from "../../util/FileUploadS3";

import DeliveryLogModule from "./DeliveryLog";
import StopModule from "./Stop";
import ScalarModule from "../virtual/Scalar";

import Models from "../../models";

const { Delivery, DeliveryLog, Stop } = Models;

const typeDefs = gql`
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
    senderStop: async (parent) => {
      return await Stop.query().findOne({
        id: parent.senderTokStopId,
      });
    },
    recipientStop: async (parent) => {
      return await Stop.query().findOne({
        id: parent.recipientTokStopId,
      });
    },
    logs: async (parent) => {
      return await DeliveryLog.query().where({
        tokDeliveryId: parent.id,
      });
    },
  },
  Query: {
    getDeliveries: async (_, { filter = {} }) => {
      try {
        const { tokConsumerId, tokDriverId, status, statusIn } = filter;

        const result = await Delivery.query().modify((builder) => {
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
      } catch (e) {
        throw e;
      }
    },

    getDeliveriesCountByStatus: async (_, { filter = {} }) => {
      try {
        const { tokConsumerId } = filter;

        const result = await Delivery.query()
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
      } catch (e) {
        throw e;
      }
    },
  },
  Mutation: {
    postDelivery: async (_, { input }, { Models }) => {
      try {
        // Insert a delivery record for each recipient.
        await Promise.all(
          input.recipientStop.map(async (item, index) => {
            const notes = input.recipientStop[index].notes; // save recipient notes before being deleted
            const cargo = input.recipientStop[index].cargo;

            delete input.recipientStop[index].notes; //remove recipient notes. Notes is under Delivery, not Stop
            delete input.recipientStop[index].cargo;

            // Create delivery record
            const insertedDelivery = await Delivery.query().insertGraph({
              ...input,
              recipientStop: input.recipientStop[index],
              notes, // insert the notes back
              cargo,
              status: 1, // Order Placed
            });

            // Create delivery log with status = 1 || Order Placed
            await DeliveryLog.query().insert({
              status: 1,
              tokDeliveryId: insertedDelivery.id,
              createdAt: insertedDelivery.createdAt,
            });
          })
        );

        return "Delivery Posted";
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    // Driver accepts a delivery order
    patchDeliveryAccepted: async (_, { input }, { Models }) => {
      try {
        // Find the delivery record using input.deliveryId
        const delivery = await Delivery.query().findById(input.deliveryId);

        // Throw error if delivery record does not exist
        if (!delivery) {
          throw new UserInputError("Delivery record does not exist.");
        }

        // Update delivery record and set driverId
        // Also update status = 2 | Delivery Scheduled
        // TODO: Get driverId from authentication header
        await Delivery.query()
          .findById(input.deliveryId)
          .patch({ tokDriverId: input.driverId, status: 2 });

        // Create delivery log with status = 2
        await DeliveryLog.query().insert({
          status: 2,
          tokDeliveryId: input.deliveryId,
        });

        return "Delivery successfully accepted.";
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    // Driver updates the status of a delivery order
    patchDeliveryIncrementStatus: async (_, { input }) => {
      try {
        console.log(input.file);
        // Find the delivery record.
        let delivery = await Delivery.query().findById(input.deliveryId);

        // Throw error if delivery does not exist
        if (!delivery) {
          throw new UserInputError("Delivery record does not exist.");
        }

        // Throw error if status not in [2,3,4,5]
        if (![2, 3, 4, 5].includes(delivery.status)) {
          throw new UserInputError("Delivery status is invalid.");
        }

        // Update/Increment the delivery status
        await Delivery.query()
          .findById(input.deliveryId)
          .increment("status", 1);

        let uploadedFile;

        if (input.file) {
          uploadedFile = await fileUploadS3({
            file: input.file,
            folder: "toktok/",
            // thumbnailFolder: 'user_verification_documents/thumbnail/'
          });
        }

        // Create delivery log with status incremented status
        await DeliveryLog.query().insert({
          status: delivery.status + 1,
          tokDeliveryId: input.deliveryId,
          ...(input.file ? { image: uploadedFile.filename } : {}),
        });

        // Return the delivery record
        return await Delivery.query().findById(input.deliveryId);
      } catch (e) {
        throw e;
      }
    },

    // Customer cancels a delivery order
    patchDeliveryCancel: async (_, { input }) => {
      try {
        // Find the delivery record using input.deliveryId
        const delivery = await Delivery.query().findById(input.deliveryId);

        // Throw error if delivery record does not exist
        if (!delivery) {
          throw new UserInputError("Delivery record does not exist.");
        }

        // Update delivery status to 7 - Cancelled
        await Delivery.query().findById(input.deliveryId).patch({ status: 7 });

        // Create delivery log with status = 7
        await DeliveryLog.query().insert({
          status: 7,
          tokDeliveryId: input.deliveryId,
        });

        return await Delivery.query().findById(input.deliveryId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    // Customer deletes a delivery order
    patchDeliveryDelete: async (_, { input }) => {
      try {
        // Find the delivery record using input.deliveryId
        const delivery = await Delivery.query().findById(input.deliveryId);

        // Throw error if delivery record does not exist
        if (!delivery) {
          throw new UserInputError("Delivery record does not exist.");
        }

        // Update delivery status to 8 - Deleted
        await Delivery.query().findById(input.deliveryId).patch({ status: 8 });

        // Create delivery log with status = 8
        await DeliveryLog.query().insert({
          status: 8,
          tokDeliveryId: input.deliveryId,
        });

        return "Order successfully deleted.";
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    // Customer rebooks a delivery order
    patchDeliveryRebook: async (_, { input }) => {
      try {
        // Find the delivery record using input.deliveryId
        const delivery = await Delivery.query()
          .findById(input.deliveryId)
          .withGraphFetched({
            senderStop: true,
            recipientStop: true,
          });

        // Throw error if delivery record does not exist
        if (!delivery) {
          throw new UserInputError("Delivery record does not exist.");
        }

        const {
          tokConsumerId,
          distance,
          duration,
          price,
          senderStop,
          recipientStop,
          notes,
        } = delivery;

        delete senderStop.id;
        delete recipientStop.id;

        // Create delivery record
        const insertedDelivery = await Delivery.query().insertGraph({
          tokConsumerId,
          distance,
          duration,
          price,
          senderStop,
          recipientStop,
          notes,
          status: 1, // Order Placed
        });

        // Create delivery log with status = 1 || Order Placed
        await DeliveryLog.query().insert({
          status: 1,
          tokDeliveryId: insertedDelivery.id,
          createdAt: insertedDelivery.createdAt,
        });

        return "Delivery successfully booked.";
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

import { GraphQLModule } from "@graphql-modules/core";
export default new GraphQLModule({
  imports: [DeliveryLogModule, ScalarModule, StopModule],
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
