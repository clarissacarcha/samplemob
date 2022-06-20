import React, { useState , useEffect , useCallback } from 'react'
import {View,Text,StyleSheet,Switch,Platform,TouchableOpacity,ActivityIndicator} from 'react-native'
import {AlertOverlay} from 'src/components'
import { useDispatch } from 'react-redux'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_REGISTERED_BIOMETRIC , GET_VERIFY_SIGNATURE , POST_REGISTER_BIOMETRICS , POST_FORCE_DISABLE} from 'toktokwallet/graphql'
import { useLazyQuery, useQuery , useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import {useAlert} from 'src/hooks'
import ReactNativeBiometrics from 'react-native-biometrics'
import { getUniqueId , getBrand, getModel } from 'react-native-device-info';
import { useNavigation , useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage'
import { PromptModal } from 'toktokwallet/components'
import moment from 'moment';
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

const Biometrics = ({setErrorMessage , setPinCode})=> {
    const alert = useAlert();
    const navigation = useNavigation();
    const [isSensorAvailable,setIsSensorAvailable] = useState(null)
    const [showPrompt,setShowPrompt] = useState(false)
    const [bioRecord,setBioRecord] = useState(null)
    const [postRegisterBiometrics , {loading: postPublicKeyLoading}] = useMutation(POST_REGISTER_BIOMETRICS,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> onErrorAlert({alert,error}),
        onCompleted: ({postRegisterBiometrics})=>{
            return
        }
    })

    const checkSensor = async ()=> {
        const { available, biometryType } = await ReactNativeBiometrics.isSensorAvailable()
        if (available && biometryType === ReactNativeBiometrics.TouchID) {
            setIsSensorAvailable(true)
        } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
            setIsSensorAvailable(true)
        } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
            setIsSensorAvailable(true)
        } else {
            setIsSensorAvailable(false)
        }
    }
    
    const CreateKey = async ()=> {
        const resultObject = await ReactNativeBiometrics.createKeys(`Confirm fingerprint using ${getUniqueId()}`)
        const { publicKey } = resultObject
        postRegisterBiometrics({
            variables: {
                input: {
                    deviceId: getUniqueId(),
                    deviceName: `${await getBrand()} ${await getModel()}`,
                    platform: Platform.select({
                        android: "A",
                        ios: "I"
                    }),
                    publicKey: publicKey,
                }
            }
        })
    }

    const checkIfKeyExist = async ()=> {
        const { keysExist } = await ReactNativeBiometrics.biometricKeysExist()
        if(!keysExist){
            CreateKey()
        }
    }

    useEffect(()=>{
        console.log(bioRecord)
        if(bioRecord){
            checkSensor()
            checkIfKeyExist()
        }
    },[bioRecord])

    useFocusEffect(useCallback(()=>{
        refetch();
     },[]))

    const [getVerifySignature , {loading: verifyLoading}] = useLazyQuery(GET_VERIFY_SIGNATURE,{
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: async ({getVerifySignature})=>{
            const { verifiedToken } = getVerifySignature
            await AsyncStorage.setItem('toktokWalletAuthenticationToken', verifiedToken);
            // navigation.pop();
            navigation.navigate("ToktokWalletHomePage");
        },
        onError: (error) => {
            const {graphQLErrors, networkError} = error;
            if(graphQLErrors[0].message == "Account Biometric Record not found"){
                // disable bio record here
                return setShowPrompt(true)
            }
            onErrorAlert({alert,error})
        } 
    })

    const [postForceDisable , {}] = useMutation(POST_FORCE_DISABLE, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted:({postForceDisable})=>{
            return navigation.replace("ToktokWalletLoginPage")
        },
        onError: (error) => onErrorAlert({alert,error})
    })

    const {data ,error, loading,refetch} = useQuery(GET_REGISTERED_BIOMETRIC,{
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        variables: {
            input: {
                deviceId: getUniqueId()
            }
        },
        onError: (error)=> onErrorAlert({alert,error}),
        onCompleted: ({getRegisteredBiometric})=>setBioRecord(getRegisteredBiometric)
    })

    if(loading){
        return <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={24} color={COLOR.YELLOW} />
            </View>
    }
    if(error) return null
    if(!data || !data?.getRegisteredBiometric?.status) return null

    const bioLogin = async ()=> {
       setPinCode("")
       const epochTimeSeconds = parseInt(moment().valueOf().toString, 10).toString()
       const payload = epochTimeSeconds + getUniqueId()

       try{
            setErrorMessage("")
            const { success, signature  } = await ReactNativeBiometrics.createSignature({
                promptMessage: 'Verify Biometric',
                payload: payload
            })
        

            if (success) {
                getVerifySignature({
                    variables: {
                        input: {
                            deviceId: getUniqueId(),
                            payload: payload,
                            signature: signature
                        }
                    }
                })
            }
       }catch(error){
           const compareMessage = "Too many attempts. Try again later."
           if(error.message != compareMessage.trim()){
            // disable bio record here
            setShowPrompt(true)
            setErrorMessage("")
            return
           }
           setErrorMessage(error.message)
       }
    }

    const disableCurrentBio = async ()=> {
          // disable to db
          postForceDisable({
              variables: {
                  input: {
                      id:  bioRecord?.id
                  }
              }
          })

    }

    return(
        <>
        <AlertOverlay visible={verifyLoading || postPublicKeyLoading}/>
        <PromptModal 
                visible={showPrompt}
                event="warning"
                message="Biometrics has been disabled on this device. You can enable this feature in toktokwallet settings."
                title="Attention"
                onPress={disableCurrentBio}
        />

       {
           bioRecord?.status == 1 &&
           <TouchableOpacity onPress={bioLogin} style={styles.container}>
                <Text style={styles.labelText}>or login with Fingerprint</Text>
            </TouchableOpacity>
       }
        
    
       </>
    )

}

const styles = StyleSheet.create({
    container: {
        justifyContent:"center",
        alignItems:"center",
        marginTop: 5,
        padding: 10,
    },
    labelText:{
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M,
        color: COLOR.ORANGE
    }
})

export default Biometrics