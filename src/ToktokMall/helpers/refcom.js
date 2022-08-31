export const getRefComAccountType = ({session}) => {

	let accountType = session.user?.consumer?.franchiseeAccountType

  if(accountType == null || accountType == ""){
		return ""
	}else{
		return accountType
	}
	
}