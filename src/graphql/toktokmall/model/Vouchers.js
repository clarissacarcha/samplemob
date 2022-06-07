import gql from 'graphql-tag'

export const GET_APPLY_VOUCHER = gql`
  query applyVoucher($input: ApplyVoucherInput) {
		applyVoucher(input: $input) {
			id
	    shopid
  	  vcode
    	vamount
    }
  }
`