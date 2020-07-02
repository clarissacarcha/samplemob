//@ts-nocheck
import { UserInputError } from "apollo-server-express";
import Models from "../models";
import knex from "../config/knex";

const { Delivery, Driver, Wallet, WalletLog, GlobalSetting } = Models;

export default class {
  /**
   * Deduct credits from rider based on delivery.comRate.
   * Distribute credits to toktok operator and rider operator.
   */
  static processCompletion = async ({ deliveryId }) => {
    try {
      const deliveryRecord = await Delivery.query().findOne({ id: deliveryId });

      // get driverUserId from delivery
      const { tokUserId: driverUserId } = await Driver.query().findOne({
        id: deliveryRecord.tokDriverId,
      });

      // Get operatorUserId from driver
      const [
        [{ tok_user_id: operatorUserId, com_rate: operatorComRate }],
      ] = await knex.raw(
        `
      SELECT O.tok_user_id, O.com_rate from tok_operators AS O
      LEFT JOIN tok_operator_drivers AS OD ON O.id = OD.tok_operator_id
      LEFT JOIN tok_drivers AS D ON D.id = OD.tok_driver_id
      WHERE D.id = ?
    `,
        [deliveryRecord.tokDriverId]
      );

      // Get toktokOperatorUserId and toktokOperatorWalletId
      const globalSettings = await GlobalSetting.query().whereIn("settingKey", [
        "toktokOperatorUserId",
        "toktokOperatorWalletId",
      ]);

      let toktokOperatorUserId = "";
      let toktokOperatorWalletId = "";

      globalSettings.map(({ settingKey, keyValue }) => {
        if (settingKey == "toktokOperatorUserId") {
          toktokOperatorUserId = keyValue;
        }

        if (settingKey == "toktokOperatorWalletId") {
          toktokOperatorWalletId = keyValue;
        }
      });

      console.log({ toktokOperatorUserId });
      console.log({ toktokOperatorWalletId });

      // Get driverWalletId
      const { id: driverWalletId } = await Wallet.query().findOne({
        tokUserId: driverUserId,
      });

      // Get operatorWalletId
      const { id: operatorWalletId } = await Wallet.query().findOne({
        tokUserId: operatorUserId,
      });

      console.log({ driverWalletId });
      console.log({ operatorWalletId });

      const deliveryCreditCost = deliveryRecord.price * deliveryRecord.comRate;

      // DRIVER
      const driverWallet = await Wallet.query().findById(driverWalletId);
      await WalletLog.query().insert({
        tokWalletId: driverWalletId,
        type: "Delivery Completion",
        balance: driverWallet.balance - deliveryCreditCost,
        incoming: 0,
        outgoing: deliveryCreditCost,
        tokDeliveryId: deliveryRecord.id,
      });
      await Wallet.query()
        .findById(driverWalletId)
        .patch({ balance: driverWallet.balance - deliveryCreditCost });

      // OPERATOR
      const operatorProfit = deliveryCreditCost * operatorComRate;
      const operatorWallet = await Wallet.query().findById(operatorWalletId);
      await WalletLog.query().insert({
        tokWalletId: operatorWalletId,
        type: "Operator Profit",
        balance: operatorWallet.balance + operatorProfit,
        incoming: operatorProfit,
        outgoing: 0,
        tokDeliveryId: deliveryRecord.id,
      });
      await Wallet.query()
        .findById(operatorWalletId)
        .patch({ balance: operatorWallet.balance + operatorProfit });

      // TOKTOK OPERATOR
      const toktokProfit = deliveryCreditCost - operatorProfit;
      const toktokWallet = await Wallet.query().findById(
        toktokOperatorWalletId
      );
      await WalletLog.query().insert({
        tokWalletId: toktokOperatorWalletId,
        type: "toktok Profit",
        balance: toktokWallet.balance + toktokProfit,
        incoming: toktokProfit,
        outgoing: 0,
        tokDeliveryId: deliveryRecord.id,
      });
      await Wallet.query()
        .findById(toktokOperatorWalletId)
        .patch({ balance: toktokWallet.balance + toktokProfit });
    } catch (error) {
      console.log(error);
      throw new UserInputError("Something went wrong.");
    }
  };
}
