import React from 'react'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_MY_ACCOUNT} from 'toktokwallet/graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import { useAlert } from 'src/hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { WalletUtility } from 'toktokwallet/util'
import {useDispatch, useSelector} from 'react-redux'

export const useAccount = ()=> {
    const alert = useAlert()
    const dispatch = useDispatch()
    const tokwaAccount = useSelector(state=>state.toktokWallet)


    const refreshWallet = async ()=> {
        const walletData = await WalletUtility.RefreshWallet()
        await dispatch({
            type: "SET_REFRESH_TOKTOKWALLET",
            payload: walletData
        })
        return
    }

    const [getMyAccount , {loading}] = useLazyQuery(GET_MY_ACCOUNT , {
        fetchPolicy:"network-only",
        client:TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: async ({getMyAccount})=> {
            await dispatch({
                type: "SET_LOADING",
                payload: true
            })
            await dispatch({
                type: "SET_TOKTOKWALLET_ACCOUNT",
                payload: getMyAccount
            })
            await refreshWallet()
            await dispatch({
                type: "SET_LOADING",
                payload: false
            })
        },
        onError: (error)=> {
            onErrorAlert({alert,error})
        }
    })

    return {
        getMyAccount,
        tokwaAccount,
        refreshWallet,
        getMyAccountLoading: loading
    }
}