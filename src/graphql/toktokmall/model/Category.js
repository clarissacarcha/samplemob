import gql from 'graphql-tag'

export const GET_FULL_CATEGORIES = gql`
  query getCategories {
		getCategories {
      parentId
      parentCategory
      parentIcon {
        raw
        name
      }
      subCategories {
        id
        subCategory
      }
    }
  }
`

export const GET_RAW_CATEGORIES = gql`
  query getCategories {
		getCategories {
      parentId
      parentCategory
      parentIcon {
        raw
        name
      }
    }
  }
`

export const GET_TOP_CATEGORIES  = gql`
query getTopCategories {
  getTopCategories {
    parentId
    parentCategory
    parentIcon {
      raw
      name
    }
  }
}
`