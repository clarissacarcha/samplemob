import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../graphql'
import {GET_WALLET,GET_TRANSACTIONS} from '../../.././../../graphql/toktokwallet'

export const RefreshWallet = async ()=> {
    try {
       const wallet = await TOKTOK_WALLET_GRAPHQL_CLIENT.query({
           fetchPolicy: "network-only",
           query: GET_WALLET,
       })

       const transactions = await TOKTOK_WALLET_GRAPHQL_CLIENT.query({
           fetchPolicy: "network-only",
           query: GET_TRANSACTIONS
       })

       return {
           wallet: wallet.data.getWallet,
           transactions: transactions.data.getTransactions
       }
    }catch(error){
        throw error
    }
}
