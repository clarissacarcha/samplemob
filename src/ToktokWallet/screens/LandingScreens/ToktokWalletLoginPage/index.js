import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View ,ActivityIndicator,StatusBar,Text,TouchableOpacity} from 'react-native'
import {SomethingWentWrong} from 'src/components'
import CONSTANTS from 'common/res/constants'
import {GET_USER_TOKTOK_WALLET_DATA} from 'toktokwallet/graphql'
import {useLazyQuery, useQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import JailMonkey from 'jail-monkey'

//SELF IMPORTS
import {
    CheckTokwaKYCRegistration,
    CheckWalletAccountRestriction,
    LoginPage,
    RootedDevice
} from "./Components";

const {COLOR} = CONSTANTS

export const ToktokWalletLoginPage = ({navigation,route})=> {
    navigation.setOptions({
        headerShown: false,
    })

    const session = useSelector(state=> state.session)
    const [isRooted,setIsRooted] = useState(false)
    const [isDebugMode,setIsDebugMode] = useState(false)

    const CheckIfDeviceIsRooted = async ()=> {
        const isDebugMode = await JailMonkey.isDebuggedMode()
        const isRooted = await JailMonkey.isJailBroken()
        setIsDebugMode(isDebugMode)
        setIsRooted(isRooted)
    }

    CheckIfDeviceIsRooted();


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
                        {
                            // isRooted || isDebugMode 
                            isRooted
                            ? <RootedDevice/>
                            : <LoginPage/>
                        }
                    </CheckWalletAccountRestriction>
                }
            </CheckTokwaKYCRegistration>
        </>
    )
}