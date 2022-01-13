import React , {useEffect,useState,useRef} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image , Keyboard} from 'react-native'
import tokwaLogo from 'toktokwallet/assets/images/tokwaLogo.png'
import {useAccount} from 'toktokwallet/hooks'
import { getStatusbarHeight } from 'toktokwallet/helper'
import { BuildingBottom , NumberBoxes ,DisabledButton } from 'toktokwallet/components'
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import { AlertOverlay } from 'src/components'
import { useNavigation } from '@react-navigation/native'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_VERIFY_MPIN } from 'toktokwallet/graphql'
import { useLazyQuery } from '@apollo/react-hooks'
import { useAlert } from 'src/hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import AsyncStorage from '@react-native-community/async-storage'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import Biometrics from "./Biometrics"

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

const numWordArray = {
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
    "10": "ten"
}

export const LoginPage = ()=> {
    const {checkIfTpinIsSet,tokwaAccount} = useAccount();

    useEffect(()=>{
     
    },[])
    const navigation = useNavigation();
    const [showPin,setShowPin] = useState(false)
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const [errorMessage,setErrorMessage] = useState("")
    const alert = useAlert()

    const [getVerifyMPIN , {data,error,loading}] = useLazyQuery(GET_VERIFY_MPIN, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: async ({getVerifyMPIN})=>{
            const { verifiedToken } = getVerifyMPIN
            await AsyncStorage.setItem('toktokWalletAuthenticationToken', verifiedToken);
            setPinCode("")
            navigation.pop();
            navigation.navigate("ToktokWalletHomePage"); 
        },
        onError: (error)=> {
            setPinCode("")
            const {graphQLErrors, networkError} = error;
            if(graphQLErrors[0]?.message == "Account Blocked"){
                onErrorAlert({alert,error})
                return navigation.replace("ToktokWalletLoginPage")
            }
            if(graphQLErrors[0]?.message == "Invalid MPincode"){
                const attempt = graphQLErrors[0].payload.remainingAttempts
                return setErrorMessage(`Incorrect MPIN. You can try ${numWordArray[attempt]} (${attempt}) more ${attempt == 1 ? 'time' : 'times'} before your account will be temporarily blocked.`)
            }

            onErrorAlert({alert,error})
            return navigation.pop()
        }
    })

    const onNumPress = ()=> {
        setTimeout(() => {
            inputRef.current.focus();
          }, 10);
    }

    const onPress = async ()=> {
   
        getVerifyMPIN({
            variables: {
                input: {
                    mpinCode: pinCode
                }
            }
        })

        Keyboard.dismiss();
    }

    useEffect(()=>{
        if(pinCode.length == 4){
            onPress()
        }
    },[pinCode])

    const forgotPIN = ()=> {
        navigation.navigate("ToktokWalletRecoveryMethods" , {type: "MPIN",event: "ACCOUNT RECOVERY", category: "FORGOT MPIN" })
    }

    return (
        <>
        <AlertOverlay visible={loading} />
            <View style={styles.container}>
                <TouchableOpacity
                   onPress={()=>navigation.pop()} 
                   style={{marginTop: getStatusbarHeight,flexDirection:"row",alignItems:"center",width:80}}
                >
                    <VectorIcon iconSet={ICON_SET.FontAwesome5} name="chevron-left" size={20}/>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M , color: COLOR.YELLOW, marginLeft: 10}}>Home</Text>
                </TouchableOpacity>
                <View style={styles.content}>
                    <Image
                        style={styles.tokwaLogo}
                        source={tokwaLogo}
                        resizeMode="contain"
                    />
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,alignSelf:"center"}}>Enter MPIN</Text>
                    <View style={{position: 'relative',marginTop: 30,}}>
                        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin} numberOfBox={4}/>
                        <TextInput
                            caretHidden
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 4) {
                                const num = value.replace(/[^0-9]/g, '')
                                setPinCode(num);
                            }
                            }}
                            onSubmitEditing={pinCode.length == 4 ? onPress: null}
                        />
                        {
                            errorMessage != "" &&  <Text style={{paddingHorizontal: 16,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.RED,alignSelf:"center"}}>{errorMessage}</Text>   
                        }
                        <Biometrics
                            setErrorMessage={setErrorMessage}
                            setPinCode={setPinCode}
                        />
                        <TouchableOpacity
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={()=>setShowPin(!showPin)}
                        >
                                <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>{showPin ? "HIDE MPIN" : "SHOW MPIN"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                                style={{paddingVertical: 10,alignItems: "center"}}
                                onPress={forgotPIN}
                        >
                                <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>FORGOT MPIN?</Text>
                        </TouchableOpacity>
                       
                    </View>
                </View>
                {/* <View style={styles.btn}>
                    {
                        pinCode.length == 4
                        ? <YellowButton label="Proceed" onPress={onPress}/>
                        : <DisabledButton label="Proceed"/>
                    }
                
                </View> */}
                
                <BuildingBottom/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
    },
    content: {
        flex: 1,
        justifyContent:"flex-start",
        alignItems:"center",
        paddingTop: 100,
        textAlign:"center",
    },
    tokwaLogo: {
        height: 100,
        width: 100,
        marginBottom: 40,
    },
    btn: {

    }
})