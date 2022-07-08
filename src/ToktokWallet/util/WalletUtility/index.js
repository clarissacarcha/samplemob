import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_WALLET, GET_TRANSACTIONS_PAGINATE} from 'toktokwallet/graphql';
export class WalletUtility {
  static RefreshWallet = async () => {
    try {
      const wallet = await TOKTOK_WALLET_GRAPHQL_CLIENT.query({
        fetchPolicy: 'network-only',
        query: GET_WALLET,
      });

      const transactions = await TOKTOK_WALLET_GRAPHQL_CLIENT.query({
        fetchPolicy: 'network-only',
        variables: {
          input: {
            afterCursorId: null,
          },
        },
        query: GET_TRANSACTIONS_PAGINATE,
      });

      return {
        wallet: wallet.data.getWallet,
        transactions: transactions.data.getTransactionsPaginate.edges,
      };
    } catch (error) {
      throw error;
    }
  };
}
