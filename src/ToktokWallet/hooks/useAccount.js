import React from 'react'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_MY_ACCOUNT, GET_GLOBAL_SETTINGS} from 'toktokwallet/graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import { useAlert } from 'src/hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { WalletUtility } from 'toktokwallet/util'
import { useNavigation } from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'

const mapKeyValueToObject = keyValueArray => {
    const result = {};
    keyValueArray.map(kv => {
      result[kv.settingKey] = kv.keyValue;
    });
  
    return result;
};

export const useAccount = ()=> {
    const alert = useAlert()
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const tokwaAccount = useSelector(state=>state.toktokWallet)

    const refreshWallet = async ()=> {
        const walletData = await WalletUtility.RefreshWallet()
        await dispatch({
            type: "SET_REFRESH_TOKTOKWALLET",
            payload: walletData
        })
        await dispatch({
            type: "SET_LOADING",
            payload: false
        })
        return
    }

    const [getGlobalSettings , {loading: getGlobalSettingsLoading}] = useLazyQuery(GET_GLOBAL_SETTINGS, {
        fetchPolicy: "network-only",
        client:TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted:({getGlobalSettings})=> {
            const constantObject = mapKeyValueToObject(getGlobalSettings)
            dispatch({
                type: "SET_TOKWA_CONSTANTS",
                payload: constantObject
            })
        },
        onError: (error)=> onErrorAlert({alert,error})
    })

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
            if(options?.isOnErrorAlert || options?.isOnErrorAlert == undefined){
                onErrorAlert({alert,error});
            }
        }
    })

    const checkIfTpinIsSet = ()=> {
        const status = tokwaAccount.pinCode
        console.log(status , "PINCODE IS ")
        if(!status){
            navigation.navigate("ToktokWalletRestricted" , {component: "noPin"})
            return false
        }
        return true
    }



    return {
        getMyAccount,
        tokwaAccount,
        refreshWallet,
        checkIfTpinIsSet,
        getMyAccountLoading: loading,
        getGlobalSettings,
        getGlobalSettingsLoading
    }
}