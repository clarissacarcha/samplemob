import gql from 'graphql-tag'

export const GET_FAVORITES = gql`
    query {
        getFavorites {
            id
            accountId
            status
            favoriteAccount {
                id
                mobileNumber
                person {
                    firstName
                    lastName
                }
            }
        }
    }
`

export const POST_FAVORITE = gql`
    mutation postFavorite($input: PostFavoriteInput){
        postFavorite(input: $input)
    }
`

export const PATCH_REMOVE_FAVORITE = gql`
    mutation patchRemoveFavorite($input: PatchRemoveFavoriteInput){
        patchRemoveFavorite(input: $input)
    }
`