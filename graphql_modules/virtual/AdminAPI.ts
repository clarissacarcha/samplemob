//@ts-nocheck
import { gql, UserInputError } from "apollo-server-express";
import { GraphQLModule } from "@graphql-modules/core";
import NotificationUtility from "../../util/NotificationUtility";

import StopModule from "../model/Stop";

import Models from "../../models";

const { Delivery, DeliveryLog, Consumer } = Models;

const typeDefs = gql`
  input AdminPostDeliveryInput {
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

  type Mutation {
    adminPostDelivery(input: AdminPostDeliveryInput): String
    adminPatchDeliveryCancel(input: AdminPatchDeliveryCancelInput!): String
  }
`;

const resolvers = {
  Mutation: {
    adminPostDelivery: async (_, { input }, { Models }) => {
      try {
        // Insert a delivery record for each recipient.
        await Promise.all(
          input.recipientStop.map(async (item, index) => {
            const notes = input.recipientStop[index].notes; // save recipient notes before being deleted
            const cargo = input.recipientStop[index].cargo;
            const cashOnDelivery = input.recipientStop[index].cashOnDelivery;

            delete input.recipientStop[index].notes; //remove recipient notes. Notes is under Delivery, not Stop
            delete input.recipientStop[index].cargo;
            delete input.recipientStop[index].cashOnDelivery;

            // Create delivery record
            const insertedDelivery = await Delivery.query().insertGraph({
              ...input,
              recipientStop: input.recipientStop[index],
              notes, // insert the notes back
              cargo,
              cashOnDelivery,
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
