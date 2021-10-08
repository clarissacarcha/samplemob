import React, { useState , useEffect } from 'react'
import {View,Text,StyleSheet,Switch,Platform,TouchableOpacity,ActivityIndicator} from 'react-native'
import {AlertOverlay} from 'src/components'
import { useDispatch } from 'react-redux'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import {GET_REGISTERED_BIOMETRIC , GET_VERIFY_SIGNATURE , POST_REGISTER_BIOMETRICS} from 'toktokwallet/graphql'
import { useLazyQuery, useQuery , useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import {useAlert} from 'src/hooks'
import ReactNativeBiometrics from 'react-native-biometrics'
import { getUniqueId , getBrand, getModel } from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native'
import moment from 'moment';
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

const Biometrics = ({setErrorMessage})=> {
    const alert = useAlert();
    const navigation = useNavigation();
    const [bioRecord,setBioRecord] = useState(null)
    const [postRegisterBiometrics , {loading: postPublicKeyLoading}] = useMutation(POST_REGISTER_BIOMETRICS,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> onErrorAlert({alert,error}),
        onCompleted: ({postRegisterBiometrics})=>{
            return
        }
    })


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
        if(bioRecord){
            checkIfKeyExist()
        }
    },[bioRecord])


    const [getVerifySignature , {loading: verifyLoading}] = useLazyQuery(GET_VERIFY_SIGNATURE,{
        fetchPolicy:"network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getVerifySignature})=>{
            if(getVerifySignature.result){
                // navigation.pop();
                navigation.navigate("ToktokWalletHomePage");
            }
        },
        onError: (error) => onErrorAlert({alert,error})
    })

    const {data ,error, loading} = useQuery(GET_REGISTERED_BIOMETRIC,{
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
       const epochTimeSeconds = parseInt(moment().valueOf().toString, 10).toString()
       const payload = epochTimeSeconds + getUniqueId()

       try{
            setErrorMessage("")
            const { success, signature  } = await ReactNativeBiometrics.createSignature({
                promptMessage: 'Sign in',
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
           setErrorMessage(error.message)
       }
    }

    return(
        <>
        <AlertOverlay visible={verifyLoading || postPublicKeyLoading}/>
       <TouchableOpacity onPress={bioLogin} style={styles.container}>
            <Text style={styles.labelText}>or login with Fingerprint</Text>
       </TouchableOpacity>
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