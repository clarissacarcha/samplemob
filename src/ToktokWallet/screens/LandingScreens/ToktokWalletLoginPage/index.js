import React , {useState,useRef,useCallback,useEffect} from 'react'
import { View ,ActivityIndicator,StatusBar,Text,TouchableOpacity, Alert,Platform} from 'react-native'
import {SomethingWentWrong} from 'src/components'
import CONSTANTS from 'common/res/constants'
import {GET_USER_TOKTOK_WALLET_DATA} from 'toktokwallet/graphql'
import {useLazyQuery, useQuery} from '@apollo/react-hooks'
import {useSelector,useDispatch} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import { useAccount } from 'toktokwallet/hooks'
import { FlagSecureScreen } from 'toktokwallet/components'
import { useFocusEffect } from '@react-navigation/native'
import { isPinOrFingerprintSet , getApiLevel , getSystemVersion } from 'react-native-device-info';
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

export const ToktokWalletLoginPage = ({navigation,route})=> {
    navigation.setOptions({
        headerShown: false,
    })

    const session = useSelector(state=> state.session)
    const [isRooted,setIsRooted] = useState(false)
    const [canMockLocation,setCanMockLocation] = useState(false)
    const [isDebugMode,setIsDebugMode] = useState(false)
    const [trustFall,setTrustFall] = useState(false)
    const [pinSet,setPinSet] = useState(false)
    const [minApiLevel,setMinApiLevel] = useState(false)
    const [minAndroidOS,setMinAndroidOS] = useState(false)
    const { refreshWallet } = useAccount();
    const dispatch = useDispatch()

    const CheckIfDeviceIsRooted = async ()=> {
        const isRooted = await JailMonkey.isJailBroken()
        const canMockLocation = await JailMonkey.canMockLocation()
        const isDebugMode = await JailMonkey.isDebuggedMode()
        const trustFall = await JailMonkey.trustFall()
        const pinSet = await isPinOrFingerprintSet()
        const minApiLevel = await getApiLevel() >= 21
        const minAndroidOS = await getSystemVersion() >= 5
        setIsRooted(isRooted)
        setCanMockLocation(canMockLocation)
        setIsDebugMode(isDebugMode)
        setTrustFall(trustFall)
        setPinSet(pinSet)
        setMinApiLevel(minApiLevel)
        setMinAndroidOS(minAndroidOS)
    }
 
     useEffect(()=>{
         CheckIfDeviceIsRooted();
         refreshWallet();
     },[])

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

    const RenderRestricted = ()=> {
        // if(isRooted || isDebugMode){
        //     return <RootedDevice/>
        // }

        if(!pinSet){
            return <PinNotSet/>
        }

        if(!minApiLevel || !minAndroidOS){
            return <NotMinApiLevel/>
        }

        return null
    }


    return (
        <FlagSecureScreen>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            {
                //isRooted || isDebugMode ||
                !pinSet || (!minApiLevel && Platform.OS == "android") || (!minAndroidOS && Platform.OS == "android")
                ? <RenderRestricted />
                : <CheckTokwaKYCRegistration kycStatus={data.getUserToktokWalletData.kycStatus}>
    
                        <CheckWalletAccountRestriction>
                        <LoginPage/>
                        </CheckWalletAccountRestriction>
                    
                </CheckTokwaKYCRegistration>
            }
            
        </FlagSecureScreen>
    )
}