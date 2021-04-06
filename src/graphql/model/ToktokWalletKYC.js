import gql from 'graphql-tag';

export const GET_TOKTOK_WALLET_KYC = gql`
   query getToktokWallet($input: GetToktokWalletInput!){
    getToktokWallet(input: $input){
          record {
            id
            balance
            status
            tokUserId
            isVerified
            toktokWalletKYC{
              id
              fullname
              nationality
              address
              birthdate
              validIdType
              validIdNumber
              validIdCountry
              validIdPicture
              picture
              tokUserId
              status
              createdAt
            }
          }
      }
   }
`

export const POST_TOKTOK_WALLET_KYC = gql`
    mutation postToktokWalletKYC($input: PostToktokWalletKYCInput){
        postToktokWalletKYC(input: $input){
            id
            status
        }
    }
`