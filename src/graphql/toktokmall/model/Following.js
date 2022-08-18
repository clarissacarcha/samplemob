import gql from 'graphql-tag'

export const GET_MY_FOLLOWING = gql`
	query getMyFollowing($input: GetMyFollowingInput) {
		getMyFollowing(input: $input) {
			id	    
    	shop {
			id
      	shopname
      	profileImages {
        	logo
        	banner
	      }
  	  }
    }
	}
`