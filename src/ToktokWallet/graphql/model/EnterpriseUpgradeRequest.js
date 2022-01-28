import gql from 'graphql-tag'

const EnterpriseRequest = `
    id
    accountID 
    businessPermitFile
    dtiCrFile
    birFile
    barangayPermitFile
    firstIdentificationCardId 
    firstGovtIdFront
    firstGovtIdBack
    secondIdentificationCardId 
    secondGovtIdFront 
    secondGovtIdBack
    reasons
    status 
    dateApproved
    createdAt
    updatedAt
    firstIDType {
        id
        name
        isBackRequired
    }
    secondIDType {
        id
        name
        isBackRequired
    }
`

export const POST_ENTERPRISE_UPGRADE_REQUEST = gql`
    mutation postEnterpriseUpgradeRequest($input: PostEnterpriseUpgradeRequestInput){
        postEnterpriseUpgradeRequest(input: $input){
            id
        }
    }
`

export const PATCH_ENTERPRISE_UPGRADE_REQUEST = gql`
    mutation patchEnterpriseUpgradeRequest($input: PatchEnterpriseUpgradeRequestInput){
        patchEnterpriseUpgradeRequest(input: $input){
            result
        }
    }
`

export const GET_ENTERPRISE_UPGRADE_REQUEST = gql`
    query {
        getEnterpriseUpgradeRequest {
            ${EnterpriseRequest}
        }
    }
`