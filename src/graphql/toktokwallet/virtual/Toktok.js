import gql from 'graphql-tag';

export const GET_USER_TOKTOK_WALLET_DATA = gql`
    query getUserToktokWalletData($input: GetUserToktokWalletDataInput!){
        getUserToktokWalletData(input: $input){
            enterpriseToken
            accountToken
            toktokWalletAccountId
            kycStatus   
        }
    }
`