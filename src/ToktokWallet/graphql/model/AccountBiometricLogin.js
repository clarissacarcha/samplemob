import gql from 'graphql-tag'

export const GET_REGISTERED_BIOMETRIC = gql`
    query getRegisteredBiometric($input: GetRegisteredBiometricInput){
        getRegisteredBiometric(input: $input){
            id
            accountId
            deviceId
            deviceName
            platform
            active
        }
    }
`

export const POST_REGISTER_BIOMETRICS = gql`
    mutation postRegisterBiometrics($input: PostRegisterBiometricsInput){
        postRegisterBiometrics(input: $input)
    }
`

