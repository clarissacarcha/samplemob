import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View ,ActivityIndicator,StatusBar,Text} from 'react-native'
import CONSTANTS from 'common/res/constants'
import { useAccount } from 'toktokwallet/hooks'


//SELF IMPORTS
import {
    WalletLandingPage,
    CheckWalletAccountRestriction
} from "./Components";

const {COLOR} = CONSTANTS

export const ToktokWalletHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false,
    })

    const [refreshing,setRefreshing] = useState(false)
    const { refreshWallet } = useAccount();


    const onRefresh = useCallback(()=>{
        refreshWallet();
    },[])

    useEffect(()=>{
        refreshWallet();
    },[])

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <WalletLandingPage onRefresh={onRefresh} refreshing={refreshing}/>
          
        </>
    )
}
