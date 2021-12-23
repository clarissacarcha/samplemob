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
export const PATCH_LINK_TOKWA_ACCOUNT = gql`
    mutation patchLinkTokwaAccount($input: PatchLinkTokwaAccountInput){
        patchLinkTokwaAccount(input: $input){
            message
        }
    }
`

export const GET_NOTIFICATIONS_BY_CLASSIFICATION = gql`
    query getNotificationsByClassification($input: GetNotificationsByClassification!){
        getNotificationsByClassification(input: $input){
            id
            title
            body
            classification
            type
            payload
            status
            createdAt
        }
    }
`