import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_CHECK_INCOMING_WALLET_LIMIT} from 'toktokwallet/graphql';

const resolver = async ({amount, mobileNumber = null, setErrorMessage, action = null}) => {
  try {
    let responseData = null;
    let responseError = null;
    let promptMessage = '';

    await TOKTOK_WALLET_GRAPHQL_CLIENT.mutate({
      mutation: POST_CHECK_INCOMING_WALLET_LIMIT,
      variables: {
        input: {
          amount: +amount,
          mobileNumber,
          action,
        },
      },
    })
      .then(({data}) => {
        responseData = data;
      })
      .catch(error => {
        responseError = error?.response?.data ? error.response.data : error;
      });

    if (responseData) return true;

    const {code, message} = responseError.graphQLErrors[0].payload;
    console.log(responseError.graphQLErrors);
    if (code == 'WALLET_LIMIT_REACHED') {
      console.log('MESSAGE', message);
      promptMessage = message;
    }

    setErrorMessage(promptMessage);
    return promptMessage == '' ? true : false;
  } catch (error) {
    return {responseData: null, responseError: null};
  }
};

export const postCheckIncomingLimit = resolver;
