import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View ,ActivityIndicator,StatusBar,Text} from 'react-native'
import {SomethingWentWrong} from 'src/components'
import { useDispatch } from 'react-redux'
import { useAccount } from 'toktokwallet/hooks'
import { CheckIdleState } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    WalletLandingPage,
} from "./Components";

const {COLOR} = CONSTANTS

export const ToktokWalletHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false,
    })

    const [refreshing,setRefreshing] = useState(false)
    const { refreshWallet } = useAccount();
    const dispatch = useDispatch();

    const onRefresh = useCallback(()=>{
       refreshWallet();
    },[])

    useEffect(()=>{
        refreshWallet();
        dispatch({
            type: "SET_TOKWA_EVENTS_REDIRECT",
            payload: {
                event: "cashInTopUp",
                value: false,
            }
        })
    },[])

    return (
        <CheckIdleState>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <WalletLandingPage onRefresh={onRefresh} refreshing={refreshing}/>
        </CheckIdleState>
    )
}
