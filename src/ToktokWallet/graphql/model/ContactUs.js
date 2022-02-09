import gql from 'graphql-tag'

export const POST_SEND_MESSAGE = gql`
    mutation postSendMessage($input: PostSendMessageInput){
        postSendMessage(input: $input){
            message
        }
    }
`