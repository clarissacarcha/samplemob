import gql from 'graphql-tag'

export const POST_FULL_VERIFIED_UPGRADE_REQUEST = gql`
    mutation postFullyVerifiedUpgradeRequest($input: PostFullyVerifiedUpgradeRequestInput) {
        postFullyVerifiedUpgradeRequest(input: $input) {
            id
            accountId
            accountTypeId
            requestStatus
            videoCallContactDetails
            callChannelId
            preferredVcsDayMin
            preferredVcsDayMax
            preferredVcsTimeMin
            preferredVcsTimeMax
        }
    }
`
export const GET_CHECK_FULLY_VERIFIED_UPGRADE_REQUEST = gql`
    query {
        getCheckFullyVerifiedUpgradeRequest{
            hasVcs
            isPendingVcs
        }
    }
`