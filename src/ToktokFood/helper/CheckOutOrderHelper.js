import axios from 'axios';
import ENVIRONMENTS from 'src/common/res/environments';

import {useMutation} from '@apollo/react-hooks';

const BYPASS_WALLET_PIN = '123456';
const BYPASS_WALLET_REQUEST_INPUT = {
  currency: 'PHP',
  toktokuser_id: '6',
  payment_method: 'TOKTOKWALLET',
  name: 'Alvin Raquem',
  notes: 'Payment by toktokfood customer',
};

export default class CheckOutOrderHelper {
  // fee: delivery fee + order fee
  static requestTakeMoneyId = async (fee = 0, paymentMethod = '', input) => {
    console.log(fee, paymentMethod, input)
    const API_RESULT = await axios({
      url: `${ENVIRONMENTS.TOKTOKFOOD_SERVER}/graphql`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: `
          mutation {
            postRequestTakeMoney(input: {
              currency: "${input.currency}",
              amount: ${fee},
              toktokuser_id: "${input.toktokuser_id}",
              payment_method: "${paymentMethod}",
              name: "${input.name}",
              notes: "${input.notes}"
          }) {
            success
            message
            data {
              requestTakeMoneyId
              validator
              message
            }
            hash_amount
            orderRefNum
          }
        }`,
      },
    });

    return API_RESULT.data;
  };
  static verifyPin = async ({ pinCode, requestTakeMoneyId, validator }) => {
    const API_RESULT = await axios({
      url: `${ENVIRONMENTS.TOKTOKFOOD_SERVER}/graphql`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: `
          mutation {
            verifyPin(input: {
              request_money_id: "${requestTakeMoneyId}",
              pin: ${pinCode},
              pin_type: "${validator}",
          }) {
            success
            message
          }
        }`,
      },
    });

    return API_RESULT.data;
  };
}
