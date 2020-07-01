//@ts-nocheck
import { gql, UserInputError } from "apollo-server-express";
import { GraphQLModule } from "@graphql-modules/core";
import NotificationUtility from "../../util/NotificationUtility";

import { calculateOrderPrice } from "../../util/PricingCalculator";

import StopModule from "../model/Stop";

import Models from "../../models";

const { Delivery, DeliveryLog, Consumer, Driver, GlobalSetting } = Models;

const typeDefs = gql`
  input AdminPostDeliveryInput {
    tokDriverId: String
    tokConsumerId: String
    distance: Float
    duration: Int
    price: Int
    cashOnDelivery: String
    senderStop: SenderStopInput
    recipientStop: [RecipientStopInput]
  }

  input AdminPatchDeliveryCancelInput {
    deliveryId: String!
  }

  input GetAdminOrderPriceInput {
    distance: Float!
    senderAddress: AddressInput
    recipientAddress: AddressInput
  }

  type Query {
    getAdminOrderPrice(input: GetAdminOrderPriceInput!): Float
  }

  type Mutation {
    adminPostDelivery(input: AdminPostDeliveryInput): String
    adminPatchDeliveryCancel(input: AdminPatchDeliveryCancelInput!): String
  }
`;

const resolvers = {
  Query: {
    getAdminOrderPrice: async (_, { input }) => {
      const { senderAddress, recipientAddress, distance } = input;
      const price = await calculateOrderPrice({ distance });

      return price;
    },
  },
  Mutation: {
    adminPostDelivery: async (_, { input }) => {
      try {
        // Insert a delivery record for each recipient.
        await Promise.all(
          input.recipientStop.map(async (item, index) => {
            // Save fields to be deleted from recipientStop
            const notes = input.recipientStop[index].notes;
            const cargo = input.recipientStop[index].cargo;
            const cashOnDelivery = input.recipientStop[index].cashOnDelivery;

            // Delete these fields. Placed in recipient for multiple recipientStops
            delete input.recipientStop[index].notes;
            delete input.recipientStop[index].cargo;
            delete input.recipientStop[index].cashOnDelivery;

            let driverUserId = "";

            // Check for Auto Assign Deliveries
            if (input.tokDriverId) {
              const driverRecord = await Driver.query().findOne({
                id: input.tokDriverId,
              });

              if (!driverRecord.isOnline) {
                throw new UserInputError(
                  "Rider is offline. Cannot assign delivery."
                );
              }

              const [{ ongoingCount }] = await Delivery.query()
                .where({
                  tokDriverId: input.tokDriverId,
                })
                .whereIn("status", [2, 3, 4, 5])
                .count("* as ongoingCount");

              const globalSetting = await GlobalSetting.query().findOne({
                settingKey: "riderMaxOngoingOrders",
              });

              const maxOngoingCount = globalSetting.keyValue;

              if (ongoingCount >= maxOngoingCount) {
                throw new UserInputError(
                  "Rider reached the maximum number of ongoing orders."
                );
              }

              driverUserId = driverRecord.tokUserId;
            }

            //Get current commission rate
            const comRate = await GlobalSetting.query().findOne({
              settingKey: "toktokCommissionRate",
            });

            // Create delivery record
            const insertedDelivery = await Delivery.query().insertGraph({
              ...input,
              recipientStop: input.recipientStop[index],
              notes, // insert the notes back
              cargo,
              cashOnDelivery,
              comRate: comRate.keyValue,
              status: input.tokDriverId ? 2 : 1, // Order Placed
            });

            // Create delivery log with status = 1 || Order Placed
            await DeliveryLog.query().insert({
              status: 1,
              tokDeliveryId: insertedDelivery.id,
              createdAt: insertedDelivery.createdAt,
            });

            if (input.tokDriverId) {
              await DeliveryLog.query().insert({
                status: 2,
                tokDeliveryId: insertedDelivery.id,
                createdAt: insertedDelivery.createdAt,
              });

              //TODO: NOTIFY DRIVER
              NotificationUtility.notifyRiderAssignedOrder({
                deliveryId: insertedDelivery.id,
                userId: driverUserId,
              });
            }
          })
        );

        return "Delivery Posted";
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    // Customer cancels a delivery order
    adminPatchDeliveryCancel: async (_, { input }) => {
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

        // TODO: Detect if should send to user or driver. Add appFlavor in input
        const consumer = await Consumer.query().findOne({
          id: delivery.tokConsumerId,
        });

        // Create a notification and send push notifs
        NotificationUtility.notifyUser(
          {
            userId: consumer.tokUserId,
            deliveryId: delivery.id,
            deliveryStatus: 7,
          },
          "D"
        );

        return "Order successfully cancelled.";
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

export default new GraphQLModule({
  imports: [StopModule],
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
