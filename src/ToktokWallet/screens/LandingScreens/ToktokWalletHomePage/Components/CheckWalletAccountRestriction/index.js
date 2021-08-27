import React , {createContext ,useEffect} from 'react'
import { useQuery , useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_MY_ACCOUNT , GET_TRANSACTIONS } from 'toktokwallet/graphql'
import { useAlert } from 'src/hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useSelector , connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

export const CheckWalletAccountRestrictionContext = createContext({
    checkIfAllowed: null
})
const {Provider} = CheckWalletAccountRestrictionContext

const mapDispatchtoProps = (dispatch) => ({
    saveTokwaAccount: (payload)=> dispatch({
        type: "SET_TOKTOKWALLET_ACCOUNT",
        payload: payload
    }),
    getTokwaTransactions: (payload) => dispatch({
        type: "SET_TOKTOKWALLET_TRANSACTIONS",
        payload: payload
    }),
    setLoading: (payload) => dispatch({
        type: "SET_LOADING",
        payload: payload
    })
})

export const CheckWalletAccountRestriction = connect(null,mapDispatchtoProps)(({children ,saveTokwaAccount , getTokwaTransactions,setLoading})=> {
    const navigation = useNavigation()
    const alert = useAlert()
    const tokwaAccount = useSelector(state=>state.toktokWallet)

    useEffect(()=>{
        setLoading(true)
        return ()=> {
            setLoading(true)
        }
    },[])


    const [getTransactions] = useLazyQuery(GET_TRANSACTIONS, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy: 'network-only',
        onCompleted: ({getTransactions}) => {
          getTokwaTransactions(getTransactions)
          setLoading(false)
        },
      })

    const {data , error ,loading } = useQuery(GET_MY_ACCOUNT, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=>{
            onErrorAlert({alert,error})
        },
        onCompleted: ({getMyAccount})=>{
            setLoading(true)
            saveTokwaAccount(getMyAccount)
            getTransactions()
        }
    })

    if(error){
        return null
    }

    if(loading){
        return null
    }
    // if Account is Disabled or blocked
    if(data.getMyAccount.status == 2){
       navigation.replace("ToktokWalletRestricted" , {component: "blockedAccount"})
    }
    // if Account is Deleted
    if(data.getMyAccount.status == 0){
      navigation.replace("ToktokWalletRestricted" , {component: "deletedAccount"})
    }
    // if pincode is not yet set
    if(!data.getMyAccount.pinCode){
        // navigation.replace("ToktokWalletRestricted" , {component: "noPin"})
        navigation.replace("ToktokWalletRestricted" , {component: "approvedRegistration"})
    }

    if(!data.getMyAccount.mpinCode){
        navigation.replace("ToktokWalletRestricted" , {component: "approvedRegistration"})
    }

    const checkIfAllowed = () => {
       
        // account is on hold
        if(tokwaAccount.status == 3){
            navigation.push("ToktokWalletRestricted", {component: "onHold"})
            return false
        }

        return true
    }

    return (
        <Provider
            value={{
                checkIfAllowed: checkIfAllowed,
            }}
        >
            {children}
        </Provider>
    )
})
