import axios from 'axios';
import ENVIRONMENTS from 'src/common/res/environments';

import {useMutation} from '@apollo/react-hooks';

const BYPASS_WALLET_PIN = '123456';
const BYPASS_WALLET_REQUEST_INPUT = {
  currency: 'PHP',
  toktokuser_id: '13',
  payment_method: 'TOKTOKWALLET',
  name: 'Marky Neri',
  notes: 'Payment by toktokfood customer',
};

export default class CheckOutOrderHelper {
  // fee: delivery fee + order fee
  static requestTakeMoneyId = async (fee = 0) => {
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
                currency: "${BYPASS_WALLET_REQUEST_INPUT.currency}",
                amount: ${fee},
                toktokuser_id: "${BYPASS_WALLET_REQUEST_INPUT.toktokuser_id}",
                payment_method: "${BYPASS_WALLET_REQUEST_INPUT.payment_method}",
                name: "${BYPASS_WALLET_REQUEST_INPUT.name}",
                notes: "${BYPASS_WALLET_REQUEST_INPUT.notes}"
            }) {
                success
                data {
                  requestTakeMoneyId
                  validator
                  message
                }
              }
          }`,
      },
    });
    return API_RESULT.data;
  };
}
