import React, { useState , useRef , useEffect , useCallback } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,TextInput,Dimensions} from 'react-native';
import { ICON_SET, VectorIcon, YellowButton , HeaderBack , HeaderTitle } from 'src/revamp'
import { AlertOverlay } from 'src/components';
import { CheckIdleState  , DisabledButton , NumberBoxes} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'
import { BuildingBottom } from '../../../components';
import { useAccount } from 'toktokwallet/hooks'
import { useFocusEffect } from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer'


const {COLOR , FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS
const { width , height } = Dimensions.get("window")

export const ToktokWalletOTPValidator = ({navigation,route})=> {


    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[""]}/>
    })

    const callBackFunc = route?.params?.callBackFunc ? route.params.callBackFunc : null
    const errorMessage = route?.params?.errorMessage ? route.params.errorMessage : null
    const resendRequest = route?.params?.resendRequest ? route.params.resendRequest : null
    const data = route?.params?.data ? route.params.data : null

    const [otpCode,setOtpCode] = useState("")
    const inputRef = useRef();
    const {tokwaAccount} = useAccount()
    const [otpTimer,setOtpTimer] = useState(120)
    const [startCount,setStartCount] = useState(false)

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };

    // useFocusEffect(useCallback(()=>{
    //     BackgroundTimer.setTimeout(()=>{
    //         setOtpTimer(state=>state-1)
    //     },1000)
    // },[otpTimer]))

    useEffect(()=>{
        if(startCount && otpTimer >= 0){
            if(otpTimer >= 0){
                BackgroundTimer.setTimeout(()=>{
                    setOtpTimer(state=>state-1)
                },1000)
                return
            }
            setStartCount(false) 
        }
    },[otpTimer,startCount])

    useEffect(()=>{
        setOtpTimer(120)
        setStartCount(true)
    },[callBackFunc])

    return(
        <CheckIdleState>
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 80} 
                style={styles.container}
            >
                 <View style={styles.content}>
                    <View style={styles.tpinBody}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,marginTop: 30}}>Enter OTP Code sent to</Text>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.L,marginBottom: 20,}}>{tokwaAccount.mobileNumber}</Text>
                        <View style={{flexDirection:"row"}}>
                        <NumberBoxes 
                            pinCode={otpCode} 
                            onNumPress={onNumPress} 
                            showPin={true}
                        />
                         <TextInput
                                caretHidden
                                value={otpCode}
                                ref={inputRef}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                                keyboardType="numeric"
                                returnKeyType="done"
                                onChangeText={(value) => {
                                if (value.length <= 6) {
                                    const replaceValue = value.replace(/[^0-9]/g,"")
                                    setOtpCode(replaceValue);
                                }
                                }}
                               
                        />
                        
                        </View>
                        {
                            errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR,color:"red",alignSelf:"center",fontSize: 12,textAlign:'center'}}>{errorMessage}</Text>
                        }

                        <TouchableOpacity
                                    disabled={otpTimer > 0 ? true : false}
                                    style={{paddingVertical: 10,alignItems: "center"}}
                                    onPress={resendRequest}
                            >
                                <Text style={{opacity: otpTimer > 0 ? 0.7 : 1, color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Didn't get code? Tap here to resend.</Text>
                                { otpTimer > 0 && <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{otpTimer} s</Text> }
                        </TouchableOpacity>

                       
                    </View>
                    <View style={styles.proceedBtn}>
                            {
                                otpCode.length < 6
                                ? <DisabledButton label="Proceed" />
                                : <YellowButton label="Proceed" onPress={()=>{
                                    callBackFunc({Otp: otpCode , data: data})
                                }} />
                            }
                    </View>
                </View>
                <BuildingBottom/>
            </KeyboardAvoidingView>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    content: {
        flex: 1,
        padding: 16,
    },
    tpinBody: {
        flex: 1,
        alignItems:"center"
    },
    backBtn: {
        backgroundColor:"#F7F7FA",
        top: Platform.OS == "ios" ? 40 : 10, 
        left: 16,
        position:"absolute",
        zIndex: 1,
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 100,
        height: 35,
        width: 35,
    },
    proceedBtn: {
        height: 70,
        width: "100%",
        justifyContent:"flex-end",
    },
})