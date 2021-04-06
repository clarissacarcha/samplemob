import gql from 'graphql-tag';



export const GET_CASH_IN_METHODS = gql`
    query getCashInMethods($input: GetCashInMethodsInput){
        getCashInMethods(input: $input){
          id
          sourceUserId
          destinationUserId
          name
          image
          tokUserId
        }
    }
`


export const POST_WALLET_CASH_IN = gql`
    mutation postWalletCashIn($input: PostWalletCashInInput){
        postWalletCashIn(input: $input){
          signature
          merchantId
          refNo
        }
    }
`

export const PATCH_PAYPANDA_RETURN_URL = gql`
  mutation patchPayPandaReturnUrl($input: PatchPayPandaReturnUrlInput){
    patchPayPandaReturnUrl(input: $input){
      message
    }
  }
`;


export const GET_CASH_IN_LOGS = gql`
  query getCashInLogs($input: GetCashInLogsInput){
      getCashInLogs(input: $input){
        logDate
        logs {
          id
          referenceNumber
          amount
          paypandaReferenceNumber
          createdAt
          tokUserId
          tokToktokWalletLogId
          status
          trails {
            id
            status
            paypandaPostback
            createdAt
          }
        }
      }
  }
`


