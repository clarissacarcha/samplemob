import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View  , ActivityIndicator,StatusBar} from 'react-native'
import {SomethingWentWrong} from '../../../../../components'
import { COLOR } from '../../../../../res/variables'
import {GET_USER_TOKTOK_WALLET_DATA} from '../../../../../graphql/toktokwallet'
import {useLazyQuery, useQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'

//SELF IMPORTS
import WalletLandingPage from './WalletLandingPage'
import CheckTokwaKYCRegistration from './CheckTokwaKYCRegistration'
import CheckWalletAccountRestriction from "./CheckWalletAccountRestriction"


const ToktokWalletHomePage = ({navigation,route})=> {

    navigation.setOptions({
        headerShown: false,
    })

    const session = useSelector(state=> state.session)
    const [mounted, setMounted] = useState(true)
    const [refreshing,setRefreshing] = useState(false)
  

    const  {data,error,loading} = useQuery(GET_USER_TOKTOK_WALLET_DATA , {
        fetchPolicy:"network-only",
        variables: {
            input: {
                userId: session.user.id,
            }
        },
        onCompleted: async ({getUserToktokWalletData})=> {
            if( getUserToktokWalletData.accountToken ) {
                await AsyncStorage.setItem('toktokWalletAccountToken', getUserToktokWalletData.accountToken);
            }

            if( getUserToktokWalletData.enterpriseToken ){
                await AsyncStorage.setItem('toktokWalletEnterpriseToken', getUserToktokWalletData.enterpriseToken);
            }
        }
    })


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
            <CheckTokwaKYCRegistration kycStatus={data.getUserToktokWalletData.kycStatus}>
                {
                    data.getUserToktokWalletData.accountToken != null &&
                    <CheckWalletAccountRestriction>
                        <WalletLandingPage onRefresh={onRefresh} refreshing={refreshing}/>
                    </CheckWalletAccountRestriction>
                }
            </CheckTokwaKYCRegistration>
        </>
    )
}

export default ToktokWalletHomePage