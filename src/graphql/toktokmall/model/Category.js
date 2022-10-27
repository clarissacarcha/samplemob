import gql from 'graphql-tag'

export const GET_FULL_CATEGORIES = gql`
  query getCategories {
		getCategories {
      parentImg
      parentIcon
      parentCategoryName
      image
      subCategories {
        id
        categoryName
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
      parentImg
      parentIcon
      parentCategoryName
      image
      subCategories {
        id
        categoryName
      }
    }
  }
`