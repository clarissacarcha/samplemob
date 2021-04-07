import gql from 'graphql-tag';


export const POST_GCASH_ENCASHMENT = gql`
    mutation postGcashEncashment($input: PostEncashmentInput){
        postGcashEncashment(input: $input){
            message
        }
    }
`