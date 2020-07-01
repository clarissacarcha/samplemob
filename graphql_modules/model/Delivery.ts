//@ts-nocheck
import { gql, UserInputError, ApolloError } from "apollo-server-express";
import { GraphQLModule } from "@graphql-modules/core";
import { raw } from "objection";
import { gql, UserInputError } from "apollo-server-express";
import fileUploadS3 from "../../util/FileUploadS3";
import NotificationUtility from "../../util/NotificationUtility";

import DeliveryLogModule from "./DeliveryLog";
import DriverModule from "./Driver";
import StopModule from "./Stop";
import ScalarModule from "../virtual/Scalar";

import Models from "../../models";

const {
  Delivery,
  DeliveryLog,
  Stop,
  Driver,
  Consumer,
  Wallet,
  WalletLog,
  GlobalSetting,
} = Models;

const typeDefs = gql`
  type Delivery {
    id: String
    tokConsumerId: String
    distance: String
    duration: String
    cashOnDelivery: String
    price: String
    notes: String
    cargo: String
    status: Int
    createdAt: FormattedDateTime
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

  input nearestFilter {
    latitude: Float
    longitude: Float
  }

  input PostDeliveryInput {
    tokConsumerId: String
    tokDriverId: String
    distance: Float
    duration: Float
    price: String
    senderStop: SenderStopInput
    recipientStop: [RecipientStopInput]
  }

  input PatchDeliveryAcceptedInput {
    deliveryId: String!
    driverId: String!
    userId: String!
  }

  input PatchDeliveryCustomerCancelInput {
    deliveryId: String!
  }

  input PatchDeliveryDriverCancelInput {
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
    userId: String
    file: Upload
  }

  type Query {
    getDeliveries(filter: deliveryFilter): [Delivery]
    getDeliveriesCountByStatus(filter: deliveryFilter): [StatusCount]
    getNearestOrderAvailable(filter: nearestFilter): [Delivery]
  }

  type Mutation {
    postDelivery(input: PostDeliveryInput): String
    patchDeliveryCustomerCancel(
      input: PatchDeliveryCustomerCancelInput!
    ): Delivery
    patchDeliveryDriverCancel(input: PatchDeliveryDriverCancelInput!): Delivery
    patchDeliveryAccepted(input: PatchDeliveryAcceptedInput!): Delivery
    patchDeliveryDelete(input: PatchDeliveryDeleteInput!): String
    patchDeliveryRebook(input: PatchDeliveryRebookInput!): String
    patchDeliveryIncrementStatus(
      input: PatchDeliveryIncrementStatusInput!
    ): Delivery
  }
`;

export const resolvers = {
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
    driver: async (parent) => {
      const res = await Driver.query().findOne({
        id: parent.tokDriverId,
      });
      return res;
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

    getNearestOrderAvailable: async (_, { filter = {} }) => {
      try {
        const { latitude, longitude } = filter;

        const result = await Delivery.query()
          .select([
            "tok_deliveries.*",
            raw(
              "( 3959 * acos( cos( radians(?) ) * cos( radians( `sender_stop`.`latitude` ) ) * cos( radians( `sender_stop`.`longitude` ) - radians(?) ) + sin( radians(?) ) * sin(radians(`sender_stop`.`latitude`)) ) )",
              latitude,
              longitude,
              latitude
            ).as("distances"),
            "senderStop.latitude",
            "senderStop.longitude",
          ])
          .leftJoinRelated("[senderStop]")
          .where("status", 1)
          .where("tokDriverId", null)
          .orderBy("distances");

        console.log({ NEAREST: result });

        return result;
      } catch (e) {
        throw e;
      }
    },
  },
  Mutation: {
    postDelivery: async (_, { input }) => {
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

            if (input.tokDriverId) {
              console.log("AUTO ASSIGNING DELIVERY TO RIDER");
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
        const { deliveryId, driverId, userId } = input;
        // Find the delivery record using input.deliveryId
        const delivery = await Delivery.query().findById(input.deliveryId);

        // Throw error if delivery record does not exist
        if (!delivery) {
          throw new UserInputError("Delivery record does not exist.");
        }

        // Check for maximum ongoing orders count
        const [{ ongoingCount }] = await Delivery.query()
          .where({
            tokDriverId: driverId,
          })
          .whereIn("status", [2, 3, 4, 5])
          .count("* as ongoingCount");

        const globalSetting = await GlobalSetting.query().findOne({
          settingKey: "riderMaxOngoingOrders",
        });

        const maxOngoingCount = globalSetting.keyValue;

        if (ongoingCount >= maxOngoingCount) {
          throw new UserInputError(
            "You have reached the maximum number of ongoing orders. Please complete your ongoing orders first."
          );
        }

        //Summarize price from all accepted orders
        const floatingCredit = await Delivery.query()
          .sum("price as floating")
          .findOne("tokDriverId", input.driverId)
          // .where("tokDriverId", driverId)
          .groupBy("tokDriverId");

        const balanceCredit = await Wallet.query().findOne({
          tokUserId: input.userId,
        });

        const remainingCredit =
          balanceCredit.balance - floatingCredit ? floatingCredit.floating : 0;

        const order = await Delivery.query().findById(input.deliveryId);

        //Throw error if floating credit is not enough for the order price.
        // if (remainingCredit < order.price) {
        //   throw new ApolloError(
        //     "Cannot accept order. Not enough credit points."
        //   );
        // }

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

        const consumer = await Consumer.query().findOne({
          id: delivery.tokConsumerId,
        });

        // Create a notification and send push notifs
        NotificationUtility.notifyUser(
          {
            userId: consumer.tokUserId,
            deliveryId: delivery.id,
            deliveryStatus: 2,
          },
          "C"
        );

        return await Delivery.query().findById(input.deliveryId);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    // Driver updates the status of a delivery order
    patchDeliveryIncrementStatus: async (_, { input }) => {
      try {
        const { deliveryId, userId, file } = input;

        // Find the delivery record.
        let delivery = await Delivery.query().findById(deliveryId);

        // Throw error if delivery does not exist
        if (!delivery) {
          throw new UserInputError("Delivery record does not exist.");
        }

        // Throw error if status not in [2,3,4,5]
        if (![2, 3, 4, 5].includes(delivery.status)) {
          throw new UserInputError("Delivery status is invalid.");
        }

        // Update/Increment the delivery status
        await Delivery.query().findById(deliveryId).increment("status", 1);

        let uploadedFile;

        if (file) {
          uploadedFile = await fileUploadS3({
            file,
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

        const consumer = await Consumer.query().findOne({
          id: delivery.tokConsumerId,
        });

        // Deduct wallet credits on completed orders
        if (delivery.status + 1 == 6) {
          const wallet = await Wallet.query().findOne({
            tokUserId: userId,
          });

          const newBalance = wallet.balance - delivery.price;

          await Wallet.query()
            .findOne({ id: wallet.id })
            .patch({ balance: newBalance });

          await WalletLog.query().insert({
            tokWalletId: wallet.id,
            type: "Delivery Completion",
            balance: newBalance,
            incoming: 0,
            outgoing: delivery.price,
          });
        }

        // Create a notification and send push notifs
        NotificationUtility.notifyUser(
          {
            userId: consumer.tokUserId,
            deliveryId: delivery.id,
            deliveryStatus: delivery.status + 1,
          },
          "C"
        );

        // Return the delivery record
        return await Delivery.query().findById(input.deliveryId);
      } catch (e) {
        throw e;
      }
    },

    // Customer cancels a delivery order
    patchDeliveryCustomerCancel: async (_, { input }) => {
      try {
        const { deliveryId } = input;

        // Find the delivery record using input.deliveryId
        const delivery = await Delivery.query().findById(deliveryId);

        // Throw error if delivery record does not exist
        if (!delivery) {
          throw new UserInputError("Delivery record does not exist.");
        }

        // Update delivery status to 7 - Cancelled
        await Delivery.query().findById(deliveryId).patch({ status: 7 });

        // Create delivery log with status = 7
        await DeliveryLog.query().insert({
          status: 7,
          tokDeliveryId: deliveryId,
        });

        const driver = await Driver.query().findOne({
          id: delivery.tokDriverId,
        });

        // Create a notification and send push notifs
        NotificationUtility.notifyUser(
          {
            userId: driver.tokUserId,
            deliveryId: delivery.id,
            deliveryStatus: 7,
          },
          "D"
        );

        return await Delivery.query().findById(deliveryId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    // Driver cancels a delivery order
    patchDeliveryDriverCancel: async (_, { input }) => {
      try {
        const { deliveryId } = input;

        // Find the delivery record using input.deliveryId
        const delivery = await Delivery.query().findById(deliveryId);

        // Throw error if delivery record does not exist
        if (!delivery) {
          throw new UserInputError("Delivery record does not exist.");
        }

        // Update delivery status to 7 - Cancelled
        await Delivery.query().findById(deliveryId).patch({ status: 7 });

        // Create delivery log with status = 7
        await DeliveryLog.query().insert({
          status: 7,
          tokDeliveryId: deliveryId,
        });

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
          "C"
        );

        return await Delivery.query().findById(deliveryId);
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

export default new GraphQLModule({
  imports: [DeliveryLogModule, ScalarModule, StopModule, DriverModule],
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
