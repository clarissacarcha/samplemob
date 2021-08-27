import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View ,ActivityIndicator,StatusBar,Text} from 'react-native'
import {SomethingWentWrong} from 'src/components'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    WalletLandingPage,
    CheckTokwaKYCRegistration,
    CheckWalletAccountRestriction
} from "./Components";

const {COLOR} = CONSTANTS

export const ToktokWalletHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false,
    })

    const [refreshing,setRefreshing] = useState(false)


    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        setTimeout(() => {
            navigation.replace("ToktokWalletHomePage")
            setRefreshing(false)
        }, 200);

    },[])

    if (loading) {
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={24} color={COLOR.YELLOW} />
          </View>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }


    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <WalletLandingPage onRefresh={onRefresh} refreshing={refreshing}/>
        </>
    )
}
