import React , {useEffect,useState,useRef} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,TextInput, TouchableHighlight} from 'react-native'
import {useSelector} from 'react-redux'
import { HeaderBackClose , HeaderTitle , AlertOverlay} from 'src/components'
import { useMutation ,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { GET_FORGOT_AND_RECOVER_OTP_CODE , VERIFY_FORGOT_AND_RECOVER_OTP_CODE , PATCH_RECOVER_ACCOUNT } from 'toktokwallet/graphql'
import { onError, onErrorAlert } from 'src/util/ErrorUtility'
import {useAlert, usePrompt} from 'src/hooks'
import {DisabledButton, Separator, BuildingBottom,CheckIdleState} from 'toktokwallet/components'
import { HeaderBack, YellowButton } from 'src/revamp'
import { TransactionUtility } from 'toktokwallet/util'
import BackgroundTimer from 'react-native-background-timer';
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    SuccessfulModal
} from "./Components";

const { FONT_FAMILY: FONT , COLOR , FONT_SIZE , SIZE } = CONSTANTS

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

const NumberBox = ({onPress, value , showPin}) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR.YELLOW} style={{borderRadius: 10,marginHorizontal: 5,}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 25,fontFamily: FONT.BOLD}}>{value ? showPin ? value : "*" : ''}</Text>
      </View>
    </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress, showPin}) => {

    const numberBoxes = [];
    var i;
    for (i = 0; i <= 5; i++) {
      numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} showPin={showPin}/>);
    }
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20,alignSelf:"center",marginTop: 20}}>
            {numberBoxes}
        </View>
    );
};


export const ToktokWalletAccountRecoveryOTP = ({navigation , route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['','']}/>,
    })

    const prompt = usePrompt()
    const [visible ,setVisible] = useState(false)
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const alert = useAlert();
    const [otpTimer,setOtpTimer] = useState(120)
    const [errorMessage,setErrorMessage] = useState("")
    const [otpCodeAttempt , setOtpCodeAttempt] = useState("")

    const [getForgotAndRecoverOTPCode] = useLazyQuery(GET_FORGOT_AND_RECOVER_OTP_CODE , {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getForgotAndRecoverOTPCode})=>{
            console.log(getForgotAndRecoverOTPCode)
            setOtpTimer(120)
        },
        onError: (error)=>{
            // const {graphQLErrors, networkError} = error
            // if(graphQLErrors[0]?.payload?.code == "OTPMAXREQUEST"){
            //     setPinCode("")
            //     return setErrorMessage(graphQLErrors[0].message)
            // }
            onErrorAlert({alert,error})
        }
    })

    const [patchRecoverAccount, {loading: patchAccountLoading}] = useMutation(PATCH_RECOVER_ACCOUNT, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({patchRecoverAccount})=>{
            setVisible(true)
        },
        onError: (error) => onErrorAlert({alert,error})
    })

    const [verifyForgotAndRecoverOTP , {loading}] = useLazyQuery(VERIFY_FORGOT_AND_RECOVER_OTP_CODE, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({verifyForgotAndRecoverOTP})=>{
            patchRecoverAccount()
        },
        onError: (error)=>{
            // const {graphQLErrors, networkError} = error
            // if(graphQLErrors[0].message == "Invalid verification code."){
            //     return setErrorMessage("Invalid verification code.")
            // }
            // if(graphQLErrors[0].message == "Verification code already expired."){
            //     return setErrorMessage("Verification code already expired.")
            // }
            // onErrorAlert({alert,error})
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt,
                setErrorMessage
            })
        }
    })
   
    const ConfirmVerificationCode = () => {
        verifyForgotAndRecoverOTP({
            variables: {
                input: {
                    OTPCode: pinCode
                }
            }
        })
    }


    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };


    // useEffect(()=>{
    //     getForgotAndRecoverOTPCode()
    //     return ()=> {

    //     }
    // },[])

    useEffect(()=>{
        if(otpTimer >= 0){
            BackgroundTimer.setTimeout(()=>{
                setOtpTimer(state=>state - 1)
            },1000)
        }
        
    },[otpTimer])

    return (
        <CheckIdleState>
        <Separator />
        <SuccessfulModal visible={visible} setVisible={setVisible}/>
        <AlertOverlay visible={patchAccountLoading}/>
        <KeyboardAvoidingView 
            style={styles.container}
            // keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 90} 
            keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 80} 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
        >
                <View style={{flex: 1,alignItems:"center",marginTop: 40}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: 16}}>Enter OTP code sent to</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: 16}}>{tokwaAccount.mobileNumber}</Text>

                        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={true}/>
                        <TextInput
                            caretHidden
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 6) {
                                const code = value.replace(/[^0-9]/,"")
                                setPinCode(code);
                            }
                            }}
                            // onSubmitEditing={onSubmit}
                        />
                        {/* {
                            errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,color: COLOR.RED,marginHorizontal: 16}}>{errorMessage}</Text>
                        } */}

                        {
                            errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,color: COLOR.RED,marginHorizontal: 16}}>
                               {errorMessage}
                            </Text>
                        }

                        <TouchableOpacity
                                disabled={otpTimer > 0 ? true : false}
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={getForgotAndRecoverOTPCode}
                        >
                                <Text style={{opacity: otpTimer > 0 ? 0.7 : 1, color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Didn't get code? Tap here to resend.</Text>
                                { otpTimer > 0 && <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{otpTimer} s</Text> }
                        </TouchableOpacity>

                </View>
                       
                 <View style={{height: SIZE.FORM_HEIGHT + 16,justifyContent:"flex-end"}}> 
                    {
                        pinCode.length < 6
                        ? <DisabledButton label="Confirm"/>
                        : <YellowButton onPress={ConfirmVerificationCode} label="Confirm"/>
                    }   
            </View>
            <BuildingBottom/>
        </KeyboardAvoidingView>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"white"
    },
    input: {
        backgroundColor:"white",
        width:"100%",
        paddingVertical: 10,
        fontFamily: FONT.BOLD,
        fontSize: 20,
        marginTop: 10,
        borderRadius: 10,
        textAlign:"center",
    },  
    bottomActions: {
        flexDirection: "row",
        width:"100%",
        height: 50,
        padding: 16,
    },
    inputView: {
        backgroundColor: '#F7F7FA',
        borderRadius: 5,
        height: 48,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
