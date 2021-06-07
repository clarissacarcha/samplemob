import React , {useEffect,useState,useRef} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,TextInput, TouchableHighlight} from 'react-native'
import {useSelector} from 'react-redux'
import { HeaderBackClose , HeaderTitle} from '../../../../../../../components'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {useQuery,useLazyQuery} from '@apollo/react-hooks'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../../graphql'
import { GET_FORGOT_AND_RECOVER_OTP_CODE , VERIFY_FORGOT_AND_RECOVER_OTP_CODE} from '../../../../../../../graphql/toktokwallet'
import { onError, onErrorAlert } from '../../../../../../../util/ErrorUtility'
import {useAlert} from '../../../../../../../hooks'
import {DisabledButton, Separator} from '../../../Components'
import { HeaderBack, YellowButton } from '../../../../../../../revamp'
import { SIZE , FONT , FONT_SIZE , COLOR } from '../../../../../../../res/variables'

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


const ToktokWalletRecoverPin = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={['','']}/>,
    })

    const session = useSelector(state=>state.session)
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const alert = useAlert();
    const [otpTimer,setOtpTimer] = useState(120)

    const [getForgotAndRecoverOTPCode] = useLazyQuery(GET_FORGOT_AND_RECOVER_OTP_CODE , {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getForgotAndRecoverOTPCode})=>{
            console.log(getForgotAndRecoverOTPCode)
            setOtpTimer(120)
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
        }
    })

    const [verifyForgotAndRecoverOTP] = useLazyQuery(VERIFY_FORGOT_AND_RECOVER_OTP_CODE, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({verifyForgotAndRecoverOTP})=>{
            console.log(verifyForgotAndRecoverOTP)
            return navigation.replace("ToktokWalletUpdatePin")
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
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


    useEffect(()=>{
        getForgotAndRecoverOTPCode()
        return ()=> {

        }
    },[])

    useEffect(()=>{
        if(otpTimer >= 0){
            setTimeout(()=>{
                setOtpTimer(state=>state - 1)
            },1000)
        }
        
    },[otpTimer])

    return (
        <>
        <Separator />
        <View 
            style={styles.container}
            // keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 90} 
            // // keyboardVerticalOffset={90} 
            // behavior={Platform.OS === "ios" ? "padding" : "height"} 
        >
                <View style={{flex: 1,alignItems:"center",marginTop: 40}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: 16}}>Enter OTP code sent to</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: 16}}>{tokwaAccount.mobileNumber}</Text>
                    {/* <TextInput 
                        // autoFocus={true}
                        style={styles.input}
                        placeholder="0 0 0 0 0 0"
                        keyboardType="number-pad"
                        value={code}
                        onChangeText={(value)=>{
                            setCode(value)
                        }}
                        /> */}

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

                        <TouchableOpacity
                                disabled={otpTimer > 0 ? true : false}
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={getForgotAndRecoverOTPCode}
                        >
                                <Text style={{opacity: otpTimer > 0 ? 0.7 : 1, color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Didn't get code? Tap here to resend.</Text>
                                { otpTimer > 0 && <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{otpTimer} s</Text> }
                        </TouchableOpacity>

                </View>
                       
                 <View style={{height: SIZE.BUTTON_HEIGHT}}> 
                    {
                        pinCode.length < 6
                        ? <DisabledButton label="Proceed"/>
                        : <YellowButton onPress={ConfirmVerificationCode} label="Proceed"/>
                    }   
            </View>
        </View>
        </>
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

export default ToktokWalletRecoverPin