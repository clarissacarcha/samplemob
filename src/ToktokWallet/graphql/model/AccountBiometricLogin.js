import gql from 'graphql-tag'

export const GET_REGISTERED_BIOMETRIC = gql`
    query getRegisteredBiometric($input: GetRegisteredBiometricInput){
        getRegisteredBiometric(input: $input){
            id
            accountId
            deviceId
            deviceName
            platform
            status
        }
    }
`

export const GET_VERIFY_SIGNATURE = gql`
    query getVerifySignature($input: GetVerifySignatureInput!){
        getVerifySignature(input: $input){
            verifiedToken
        }
    }
`

export const POST_REGISTER_BIOMETRICS = gql`
    mutation postRegisterBiometrics($input: PostRegisterBiometricsInput){
        postRegisterBiometrics(input: $input)
    }
`

export const POST_FORCE_DISABLE = gql`
    mutation postForceDisable($input: PostForceDisableInput){
        postForceDisable(input: $input)
    }
`


export const POST_VERIFY_ANSWERS = gql`
    mutation postVerifyAnswers($input: PostVerifyAnswersInput){
        postVerifyAnswers(input: $input)
    }
`
