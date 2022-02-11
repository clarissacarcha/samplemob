import React , {useEffect} from 'react'
import { useQuery , useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_MY_ACCOUNT , GET_TRANSACTIONS } from 'toktokwallet/graphql'
import { useAlert } from 'src/hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { SomethingWentWrong } from 'src/components'
import { useDispatch } from 'react-redux'
import moment from 'moment'


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
    }),
    updateToktokPersonSession: (payload) => dispatch({
        type: "UPDATE_TOKTOK_PERSON_VIA_TOKTOKWALLET_INFO",
        payload: payload
    })
})

export const CheckWalletAccountRestriction = connect(null,mapDispatchtoProps)(({children ,saveTokwaAccount , getTokwaTransactions,setLoading,updateToktokPersonSession})=> {
    const navigation = useNavigation()
    const alert = useAlert()

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
            // Update toktok person session
            const person = {
                firstName: getMyAccount.person.firstName,
                middleName: getMyAccount.person.middleName,
                lastName: getMyAccount.person.lastName,
                emailAddress: getMyAccount.person.emailAddress,
                birthdate: moment(getMyAccount.person.birthdate).tz("Asia/Manila").format("YYYY-MM-DD"),
            }

            updateToktokPersonSession(person)
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

    // if Account is Dormant
    if(data.getMyAccount.isDormant){
        navigation.replace("ToktokWalletRestricted" , {component: "blockedAccount", data: { account: data.getMyAccount}})
        // navigation.replace("ToktokWalletRestricted" , {component: "dormantAccount"})
        return null
    }

    // if Account is Disabled or blocked
    if(data.getMyAccount.status == 2){
       navigation.replace("ToktokWalletRestricted" , {component: "blockedAccount", data: { account: data.getMyAccount}})
       return null
    }
    // if Account is On Hold
    if(data.getMyAccount.status == 3){
        navigation.replace("ToktokWalletRestricted", {component: "onHold"})
        return null
    }
    // if Account is Deleted
    if(data.getMyAccount.status == 0){
        navigation.replace("ToktokWalletRestricted" , {component: "deletedAccount"})
        return null
    }
    // if MPIN is not yet setup
    if(!data.getMyAccount.mpinCode){
        navigation.replace("ToktokWalletRestricted" , {component: "approvedRegistration"})
        return null
    }
    

    return (
        <>
            {children}
        </>
    )
})
