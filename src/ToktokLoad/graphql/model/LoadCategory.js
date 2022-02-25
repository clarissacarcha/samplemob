import gql from 'graphql-tag'

export const GET_LOAD_CATEGORIES = gql`
    query {
        getLoadCategories {
            id
            name
        }
    }
`

export const GET_LOAD_CATEGORY_NETWORKS = gql`
    query getLoadCategoryNetworks($input: GetLoadCategoryNetworksInput){
        getLoadCategoryNetworks(input: $input){
            id
            name
            loadCategoryId
            inputLengthId
            iconUrl
            inputLength {
                id
                name
                inputLength
            }
        }
    }
`