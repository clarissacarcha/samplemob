import React , {useState, useEffect} from 'react'
import {useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../graphql'
import { GET_WALLET , GET_MY_ACCOUNT } from '../../../../../graphql/toktokwallet'
import { useAlert } from '../../../../../hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'
import { connect } from 'react-redux'


const GetWalletAccount = ({children , setLoading})=> {

    const alert = useAlert()
    const [account,setAccount] = useState({
        wallet: {
            id: 0,
            balance: 0,
            status: 0,
            accountId: 0,
            motherId: 0,
            currencyId: 0,
            currency: {
                id: 0,
                name: "",
                code: "",
                phpValue: 0
            }
        }
    })

    const [getMyAccount , {data,error,loading}] = useLazyQuery(GET_MY_ACCOUNT , {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy: "network-only",
        onCompleted: ({getMyAccount})=> {
            setAccount(getMyAccount)
            saveTokwaAccount(getMyAccount)
        },
        onError: (error)=> {
            onErrorAlert({alert,error})
        }
    })

    useEffect(()=>{
       getMyAccount()
    },[onRefresh])


    return (
        <>
                {children}
        </>
    )
}

const mapDispatchtoProps = (dispatch) => ({
    saveTokwaAccount: (payload)=> dispatch({
        type: "SET_TOKTOKWALLET_ACCOUNT",
        payload: payload
    })
})

export default connect(null, mapDispatchtoProps)(GetWalletAccount)