import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View ,ActivityIndicator,StatusBar,Text} from 'react-native'
import {SomethingWentWrong} from 'src/components'
import CONSTANTS from 'common/res/constants'
import {GET_USER_TOKTOK_WALLET_DATA} from 'toktokwallet/graphql'
import {useLazyQuery, useQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import { useAccount } from 'toktokwallet/hooks'
import AsyncStorage from '@react-native-community/async-storage'

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

    const session = useSelector(state=> state.session)
    const [mounted, setMounted] = useState(true)
    const [refreshing,setRefreshing] = useState(false)
    const { refreshWallet } = useAccount();

    const  {data,error,loading} = useQuery(GET_USER_TOKTOK_WALLET_DATA , {
        fetchPolicy:"network-only",
        variables: {
            input: {
                userId: session.user.id,
            }
        },
        onCompleted: async ({getUserToktokWalletData})=> {
            // if( getUserToktokWalletData.accountToken ) {
            //     await AsyncStorage.setItem('toktokWalletAccountToken', getUserToktokWalletData.accountToken);
            // }

            if( getUserToktokWalletData.enterpriseToken ){
                await AsyncStorage.setItem('toktokWalletEnterpriseToken', getUserToktokWalletData.enterpriseToken);
            }
        }
    })


    const onRefresh = useCallback(()=>{
        refreshWallet();
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
            <CheckTokwaKYCRegistration kycStatus={data.getUserToktokWalletData.kycStatus}>
   
                    <CheckWalletAccountRestriction>
                        <WalletLandingPage onRefresh={onRefresh} refreshing={refreshing}/>
                    </CheckWalletAccountRestriction>
                
            </CheckTokwaKYCRegistration>
        </>
    )
}
