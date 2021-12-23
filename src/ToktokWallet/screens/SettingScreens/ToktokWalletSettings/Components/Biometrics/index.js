import React, { useState , useEffect } from 'react'
import {View,Text,StyleSheet,Switch,Platform,Linking, Alert} from 'react-native'
import {AlertOverlay} from 'src/components'
import { useDispatch } from 'react-redux'
import { PromptModal } from 'toktokwallet/components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_REGISTERED_BIOMETRIC , POST_REGISTER_BIOMETRICS} from 'toktokwallet/graphql'
import { useLazyQuery , useMutation } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native'
import { onErrorAlert } from 'src/util/ErrorUtility'
import {useAlert} from 'src/hooks'
import ReactNativeBiometrics from 'react-native-biometrics'
import { getUniqueId , getBrand, getModel ,isPinOrFingerprintSet , getFingerprint} from 'react-native-device-info';
import AndroidOpenSettings from 'react-native-android-open-settings';
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS


export const Biometrics = ()=> {

    const alert = useAlert();
    const [bioRecord,setBioRecord] = useState(null)
    const [toggle,setToggle] = useState(null)
    const [isSensorAvailable,setIsSensorAvailable] = useState(null)
    const [deviceHasBio,setDeviceHasBio] = useState(null)
    const [sensorType,setSensorType] = useState(null)
    const [keyExist,setKeyExist] = useState(null)
    const [showPrompt,setShowPrompt] = useState(false)
    const navigation = useNavigation()

    const [getRegisteredBiometric , {loading: fetchBioLoading}] = useLazyQuery(GET_REGISTERED_BIOMETRIC,{
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> onErrorAlert({alert,error}),
        onCompleted: ({getRegisteredBiometric})=>{
            setBioRecord(getRegisteredBiometric)
            if(!getRegisteredBiometric){
                setToggle(false)
            }
        }
    })

    const [postRegisterBiometrics, {data,error,loading}] = useMutation(POST_REGISTER_BIOMETRICS,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> onErrorAlert({alert,error}),
        onCompleted: ({postRegisterBiometrics})=>{
            setToggle(!toggle)
        }
    })

    useEffect(()=>{
        if(bioRecord){
            checkSensor()
            setToggle(bioRecord.status)
        }
    },[bioRecord])

    const checkSensor = async ()=> {
        const { available, biometryType } = await ReactNativeBiometrics.isSensorAvailable()


        if (available && biometryType === ReactNativeBiometrics.TouchID) {
          setSensorType("TouchID")
          setIsSensorAvailable(true)
        } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
          setSensorType("FaceID")
          setIsSensorAvailable(true)
        } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        setSensorType("Biometrics")
          setIsSensorAvailable(true)
        } else {
          console.log('Biometrics not supported')
          setSensorType(null)
          setIsSensorAvailable(false)
        }

        const deviceBio = await isPinOrFingerprintSet();
        const fingerPrint = await getFingerprint()
        setDeviceHasBio((deviceBio && fingerPrint && fingerPrint != "") ? true : false)
      }
    
      useEffect(()=>{
        checkSensor();
      },[])

      const checkIfKeyExist = async ()=> {
        const { keysExist } = await ReactNativeBiometrics.biometricKeysExist()
        setKeyExist(keysExist)
        return
      }

    useEffect(()=>{
        if(isSensorAvailable) checkIfKeyExist()
    },[isSensorAvailable])


    useEffect(()=>{
        getRegisteredBiometric({
            variables: {
                input: {
                    deviceId: getUniqueId()
                }
            }
        })
    },[])

    const CreateKey = async ()=> {
        if(await checkIfKeyExist()) return;
        const resultObject = await ReactNativeBiometrics.createKeys(`Confirm fingerprint using ${getUniqueId()}`)
        const { publicKey } = resultObject
        return publicKey
    }
    

    const changeSettings = async ()=> {
        checkSensor()
        if(!isSensorAvailable){
           setShowPrompt(true);
           return;
        }
        postRegisterBiometrics({
            variables: {
                input: {
                    deviceId: getUniqueId(),
                    deviceName: `${await getBrand()} ${await getModel()}`,
                    platform: Platform.select({
                        android: "A",
                        ios: "I"
                    }),
                    publicKey: await CreateKey(),
                    biometryType: sensorType,
                    status: bioRecord ? !bioRecord.status : !toggle
                }
            }
        })
    }

    const redirectToSettings = ()=> {
       setShowPrompt(false)
        // Linking.openSettings()
       Platform.OS == "android"
       ? AndroidOpenSettings.generalSettings()
       : Linking.openURL('App-Prefs:Settings')
    }


    // if(!isSensorAvailable){
    //     return null
    // }

    if(!deviceHasBio){
        return null
    }

    return (
        <>
         <AlertOverlay visible={loading}/>
         <PromptModal 
                visible={showPrompt}
                event="warning"
                message="Please register at least one fingerprint on your phone settings."
                title="Attention"
                closeModal={()=>setShowPrompt(false)}
                onPress={redirectToSettings}
        />
         <View style={styles.settingoption}>
                    <View style={styles.name}>
                        {
                            fetchBioLoading 
                            ? <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.XS}}>Loading...</Text>
                            : <Text style={{fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Biometrics Login {toggle ? "( Enabled )" : "( Disabled )"}</Text>
                        }
                        
                    </View>
                    {
                        toggle != null &&
                        <View style={styles.arrowright}>
                        {
                            fetchBioLoading
                            ?   <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.XS}}>Loading...</Text>
                            :    <Switch
                                    trackColor={{false: COLOR.LIGHT, true: COLOR.YELLOW}}
                                    thumbColor={toggle ? COLOR.LIGHT : COLOR.MEDIUM}
                                    onValueChange={changeSettings}
                                    value={toggle}
                                 /> 
                        }
                    
                    </View>
                    }
                   
        </View>
        <View style={styles.divider}/>
        </>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    settingoption: {
        padding: 16,
        paddingVertical: 15,
        flexDirection: "row",
        backgroundColor:"white"
    },
    logo: {
        flexBasis: 45,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    name: {
        flex: 1,
        justifyContent: "space-evenly"
    },
    arrowright: {
        flexBasis: 50,
        justifyContent: "center",
        alignItems: "flex-end"
    },
    divider: {
        height: 1,
        width: "100%",
        backgroundColor: COLOR.LIGHT,
    }
})