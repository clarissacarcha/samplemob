//@ts-nocheck
import { gql, UserInputError } from "apollo-server-express";
import Models from "../../models";

const { Delivery, DeliveryLog, Stop } = Models;

const typeDefs = gql`
  type Delivery {
    id: ID
    tokConsumerId: String
    distance: String
    duration: String
    price: String
    notes: String
    status: Int
    tokDriverId: String
    senderTokStopId: String
    recipientTokStopId: String
    senderStop: Stop
    recipientStop: Stop
  }

  input deliveryFilter {
    tokConsumerId: String
    tokDriverId: String
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

  input PatchDeliveryIncrementStatusInput {
    deliveryId: String!
    file: Upload
  }

  extend type Query {
    getDeliveries(filter: deliveryFilter): [Delivery]
  }

  extend type Mutation {
    postDelivery(input: PostDeliveryInput): String
    patchDeliveryAccepted(input: PatchDeliveryAcceptedInput!): String
    patchDeliveryIncrementStatus(
      input: PatchDeliveryIncrementStatusInput!
    ): Delivery
  }
`;

const resolvers = {
  Delivery: {
    senderStop: async (parent, _, { Models }) => {
      return await Stop.query().findOne({
        id: parent.senderTokStopId,
      });
    },
    recipientStop: async (parent, _, { Models }) => {
      return await Stop.query().findOne({
        id: parent.recipientTokStopId,
      });
    },
  },
  Query: {
    getDeliveries: async (_, { filter = {} }, { Models }) => {
      try {
        const { tokConsumerId, tokDriverId, statusIn } = filter;
        console.log(statusIn);

        const result = await Delivery.query().modify((builder) => {
          // Filter by tokConsumerId
          if (tokConsumerId) {
            builder.andWhere({ tokConsumerId });
          }

          // Filter by tokDriverId
          if (tokDriverId) {
            builder.where({ tokDriverId });
          }

          // Filter by status in array
          if (statusIn) {
            builder.whereIn("status", statusIn);
          }
        });

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
            delete input.recipientStop[index].notes; //remove recipient notes. Notes is under Delivery, not Stop

            // Create delivery record
            const insertedDelivery = await Delivery.query().insertGraph({
              ...input,
              recipientStop: input.recipientStop[index],
              notes, // insert the notes back
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

        // Create delivery log with status incremented status
        await DeliveryLog.query().insert({
          status: delivery.status++,
          tokDeliveryId: input.deliveryId,
        });

        // Return the delivery record
        return await Delivery.query().findById(input.deliveryId);
      } catch (e) {
        throw e;
      }
    },
  },
};

export default {
  typeDefs,
  resolvers,
};

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
