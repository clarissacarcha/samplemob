import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View ,ActivityIndicator,StatusBar,Text} from 'react-native'
import {SomethingWentWrong} from 'src/components'
import { useAccount } from 'toktokwallet/hooks'
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

    useEffect(()=>{
        refreshWallet();
    },[])

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
