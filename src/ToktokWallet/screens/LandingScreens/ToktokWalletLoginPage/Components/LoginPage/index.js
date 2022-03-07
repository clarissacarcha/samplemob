import React , {useEffect,useState,useRef} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Image , Keyboard} from 'react-native'
import tokwaLogo from 'toktokwallet/assets/images/tokwa2.png'
import {useAccount} from 'toktokwallet/hooks'
import { getStatusbarHeight } from 'toktokwallet/helper'
import { BuildingBottom , NumberBoxes ,DisabledButton , CircleIndicator , NumPad } from 'toktokwallet/components'
import { YellowButton , VectorIcon , ICON_SET } from 'src/revamp'
import { AlertOverlay } from 'src/components'
import { useNavigation } from '@react-navigation/native'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_VERIFY_MPIN } from 'toktokwallet/graphql'
import { useLazyQuery } from '@apollo/react-hooks'
import { useAlert } from 'src/hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import AsyncStorage from '@react-native-community/async-storage'
import AntDesign from 'react-native-vector-icons/AntDesign';
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
                // onErrorAlert({alert,error})
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
        if(pinCode.length > 0) setErrorMessage("")
        if(pinCode.length == 4){
            onPress()
        }
    },[pinCode])

    // useEffect(()=>{
    //     setTimeout(()=>{
    //         inputRef.current.focus();
    //     },0)
    // },[])

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
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,alignSelf:"center",marginTop: 20}}>Enter MPIN</Text>
                    <View style={{flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
                            <View style={{backgroundColor:COLOR.YELLOW, marginRight: 5, justifyContent:"center",alignItems:"center", height: FONT_SIZE.M,width: FONT_SIZE.M,borderRadius:  FONT_SIZE.M}}>
                                <AntDesign name="exclamation" size={FONT_SIZE.XS} color="white"/>
                            </View>
                            <Text style={{ fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Do not share your MPIN with anyone.</Text>
                    </View>
                    <View style={{position: 'relative',flex: 1,justifyContent:"center",alignItems:"center"}}>
                        <CircleIndicator pinCode={pinCode} showPin={showPin} numberOfBox={4}/>
                        {/* <TextInput
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
                        /> */}
                
                        {/* TEMPORARY DISABLE OR HIDE THIS FEATURE */}
                        {/* <Biometrics
                            setErrorMessage={setErrorMessage}
                            setPinCode={setPinCode}
                        /> */}
                        {/* <TouchableOpacity
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={()=>setShowPin(!showPin)}
                        >
                                <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{showPin ? "Hide MPIN" : "Show MPIN"}</Text>
                        </TouchableOpacity> */}
                    
                    </View>
                        {
                            errorMessage != "" &&  <Text style={{paddingHorizontal: 16,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.RED,textAlign:"center"}}>{errorMessage}</Text>   
                        }
                    <NumPad
                        setPinCode={setPinCode}
                        pinCode={pinCode}
                    />
                      <View style={{justifyContent:"center", alignItems: "center",flex: 1}}>
                       <TouchableOpacity
                                style={{}}
                                onPress={forgotPIN}
                        >
                                <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Forgot MPIN?</Text>
                        </TouchableOpacity>
                        {/* <View style={{flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
                            <View style={{backgroundColor:COLOR.YELLOW, marginRight: 5, justifyContent:"center",alignItems:"center", height: FONT_SIZE.M,width: FONT_SIZE.M,borderRadius:  FONT_SIZE.M}}>
                                <AntDesign name="exclamation" size={FONT_SIZE.XS} color="white"/>
                            </View>
                            <Text style={{ fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Do not share your MPIN with anyone.</Text>
                        </View> */}
                       
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
        // paddingTop: 20,
        textAlign:"center",
    },
    tokwaLogo: {
        height: 80,
        width: 200,
        marginTop: 20,
    },
    btn: {

    }
})