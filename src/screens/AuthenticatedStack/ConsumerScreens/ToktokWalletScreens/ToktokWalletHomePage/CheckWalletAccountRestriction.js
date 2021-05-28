import React , {createContext } from 'react'
import {useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../graphql'
import { GET_WALLET , GET_MY_ACCOUNT } from '../../../../../graphql/toktokwallet'
import { useAlert } from '../../../../../hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

export const CheckWalletAccountRestrictionContext = createContext({
    checkIfResctricted: null
})
const {Provider} = CheckWalletAccountRestrictionContext

const CheckWalletAccountRestriction = ({children})=> {

    const tokwaAccount = useSelector(state=>state.toktokWallet)

    console.log(tokwaAccount)

    
    const navigation = useNavigation()
 
    const checkIfResctricted = ()=> {
        // check if account is blocked
        if(tokwaAccount.status == 2){
            navigation.replace("ToktokWalletRestricted" , {component: "blockedAccount"})
            return true
        }

        return false
    }

    checkIfResctricted()

    return (
        <Provider
        value={{
            checkIfResctricted: checkIfResctricted
            }}
        >
            {children}
        </Provider>
    )
}

export default CheckWalletAccountRestriction