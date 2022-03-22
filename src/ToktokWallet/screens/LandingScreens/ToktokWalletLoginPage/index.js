import React , {useState,useRef,useCallback,useEffect,useMemo} from 'react'
import { View ,ActivityIndicator,StatusBar,Text,TouchableOpacity, Alert} from 'react-native'
import {SomethingWentWrong} from 'src/components'
import CONSTANTS from 'common/res/constants'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_USER_TOKTOK_WALLET_DATA ,GET_GLOBAL_SETTINGS} from 'toktokwallet/graphql'
import {useAlert, usePrompt} from 'src/hooks'
import {onErrorAlert} from 'src/util/ErrorUtility'
import {useLazyQuery, useQuery} from '@apollo/react-hooks'
import {useSelector,useDispatch} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { FlagSecureScreen , SplashHome } from 'toktokwallet/components'
import { useFocusEffect } from '@react-navigation/native'
import { isPinOrFingerprintSet , getApiLevel , getSystemVersion } from 'react-native-device-info';
import { useAccount } from 'toktokwallet/hooks'
import JailMonkey from 'jail-monkey'

//SELF IMPORTS
import {
    CheckTokwaKYCRegistration,
    CheckWalletAccountRestriction,
    LoginPage,
    NotEncrypted,
    NotMinApiLevel,
    PinNotSet,
    RootedDevice
} from "./Components";

const {COLOR} = CONSTANTS

const RenderRestricted = ({
    isRooted,
    pinSet,
    isPinCodeCheckingEnabled
})=> {
    if(isRooted) return <RootedDevice/>
    if(!pinSet && isPinCodeCheckingEnabled == "1") return <PinNotSet/>
    return null
}

const RenderAccessComponent = ({kycPep,kycStatus})=> (
    <CheckTokwaKYCRegistration kycPep={kycPep} kycStatus={kycStatus}>
        
        <CheckWalletAccountRestriction>
        <LoginPage/>
        </CheckWalletAccountRestriction>

    </CheckTokwaKYCRegistration>
)

export const ToktokWalletLoginPage = ({navigation,route})=> {
    navigation.setOptions({
        headerShown: false,
    })

    const session = useSelector(state=> state.session)
    const [isRooted,setIsRooted] = useState(false)
    const [pinSet,setPinSet] = useState(false)
    const { refreshWallet, tokwaAccount } = useAccount();
    const dispatch = useDispatch()
    const alert = useAlert();

    const CheckIfDeviceIsRooted = async ()=> {
        const isRooted = await JailMonkey.isJailBroken()
        const pinSet = await isPinOrFingerprintSet()
        setIsRooted(isRooted)
        setPinSet(pinSet)
    }
 
     useEffect(()=>{
         CheckIfDeviceIsRooted();
         refreshWallet();
         getGlobalSettings();
     },[])

     const mapKeyValueToObject = keyValueArray => {
        const result = {};
        keyValueArray.map(kv => {
          result[kv.settingKey] = kv.keyValue;
        });
      
        return result;
      };

    const [getGlobalSettings] = useLazyQuery(GET_GLOBAL_SETTINGS, {
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

    const  {data,error,loading,refetch} = useQuery(GET_USER_TOKTOK_WALLET_DATA , {
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
  
            if(getUserToktokWalletData.toktokWalletAccountId && !session.user.toktokWalletAccountId){
                // UPDATE SESSION HERE
                dispatch({
                    type: "UPDATE_TOKWA_ACCOUNT_ID_SESSION",
                    payload: getUserToktokWalletData.toktokWalletAccountId
                })
            }

            if( getUserToktokWalletData.enterpriseToken ){
                await AsyncStorage.setItem('toktokWalletEnterpriseToken', getUserToktokWalletData.enterpriseToken);
            }
        }
    })

    const kycStatus = useMemo(()=> data?.getUserToktokWalletData?.kycStatus, [data])
    const kycPep = useMemo(()=> data?.getUserToktokWalletData?.pepId, [data])

    if (loading) {
        return (
         <SplashHome/>
        );
    }

    if (error) {
        return <SomethingWentWrong />;
    }



    return (
        <FlagSecureScreen>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            {
                isRooted || ( !pinSet && tokwaAccount.constants.isPinCodeCheckingEnabled == "1" )
                ? <RenderRestricted 
                        isRooted={isRooted}
                        pinSet={pinSet}
                        isPinCodeCheckingEnabled={tokwaAccount.constants.isPinCodeCheckingEnabled }
                  />
                : <RenderAccessComponent kycPep={kycPep} kycStatus={kycStatus}/>
                
            }
            
        </FlagSecureScreen>
    )
}