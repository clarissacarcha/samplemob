//@ts-nocheck
import Models from "../models";
import knex from "../config/knex";

const { Delivery, Driver, Wallet, WalletLog } = Models;

export default class {
  /**
   * Deduct credits from rider based on delivery.comRate
   * Distribute credits to toktok operator and rider operator
   */
  static processCompletion = async ({ deliveryId }) => {
    const delivery = await Delivery.query().findOne({ id: deliveryId });
    const { tokUserId: driverUserId } = await Driver.query().findOne({
      id: delivery.tokDriverId,
    });

    const {} = await Driver.knex().raw("");

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
  };
}
