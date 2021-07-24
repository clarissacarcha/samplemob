import gql from 'graphql-tag'

export const POST_FULL_VERIFIED_UPGRADE_REQUEST = gql`
    mutation postFullyVerifiedUpgradeRequest($input: PostFullyVerifiedUpgradeRequestInput) {
        postFullyVerifiedUpgradeRequest(input: $input) {
            id
            accountID
            accountLevel
            requestStatus
            videoCallContactDetails
            callChannelId
            preferredVCSDayMin
            preferredVCSDayMax
            preferredVCSTimeMin
            preferredVCSTimeMax
        }
    }
`