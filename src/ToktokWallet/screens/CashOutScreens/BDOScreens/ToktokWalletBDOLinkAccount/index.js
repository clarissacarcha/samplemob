import React , {useState,useRef,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform} from 'react-native'
import { HeaderBack, HeaderTitle, ICON_SET, VectorIcon, YellowButton } from 'src/revamp'
import { DisabledButton, NumberBoxes, Separator, BuildingBottom , CheckIdleState, FlagSecureScreen } from 'toktokwallet/components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { PATCH_LINK_BDO_ACCOUNT , GET_BDO_LINK_OTP } from 'toktokwallet/graphql'
import { useLazyQuery , useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from 'src/util/ErrorUtility'
import { useAlert } from 'src/hooks/useAlert'
import { AlertOverlay } from 'src/components'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

export const ToktokWalletBDOLinkAccount = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[""]}/>
    })

    const { mobile , provider , accountNumber} = route.params
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const alert = useAlert()
    const [otpTimer,setOtpTimer] = useState(120)
    const [errorMessage,setErrorMessage] = useState("")

    const [patchLinkBdoAccount, {data,error,loading}] = useMutation(PATCH_LINK_BDO_ACCOUNT,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({patchLinkBdoAccount})=>{
            navigation.navigate("ToktokWalletBDOHomePage", {provider})
            return navigation.replace("ToktokWalletBDOHomePage",{provider, successLink: true})
        },
        onError: (error)=>{
            const {graphQLErrors, networkError} = error
            if(graphQLErrors[0].message == "Invalid verification code."){
                return setErrorMessage("Invalid verification code.")
            }
            if(graphQLErrors[0].message == "Verification code already expired."){
                return setErrorMessage("Verification code already expired.")
            }
            onErrorAlert({alert,error,navigation})
        }
    })


    const [getBdoLinkOTP, {loading: getOtpLoading}] = useLazyQuery(GET_BDO_LINK_OTP, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getBdoLinkOTP})=>{
            setErrorMessage("")
            setOtpTimer(120)
        },
        onError: (error)=>{
            const {graphQLErrors, networkError} = error
            if(graphQLErrors[0]?.payload?.code == "OTPMAXREQUEST"){
                setPinCode("")
                return setErrorMessage(graphQLErrors[0].message)
            }
            onErrorAlert({alert,error,navigation})
        }
    })


    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };

    const CreateVerificationCode = ()=> {
        getBdoLinkOTP({
            variables: {
                input: {
                    mobileNumber: `${mobile}`
                }
            }
        })
    }

    const ConfirmVerificationCode = ()=> {
        return patchLinkBdoAccount({
            variables: {
                input: {
                    OTPCode: pinCode,
                    mobile: `${mobile}`,
                    accountNumber: accountNumber,
                }
            }
        })
    }

    // useEffect(()=>{
    //     CreateVerificationCode()
    //     return ()=> {

    //     }
    // },[])

    useEffect(()=>{
        if(otpTimer >= 0){
            setTimeout(()=>{
                setOtpTimer(state=>state - 1)
            },1000)
        }
        
    },[otpTimer])

    return (
        <FlagSecureScreen>
        <CheckIdleState>
         <AlertOverlay visible={loading} />
        <Separator/>
        <KeyboardAvoidingView 
            style={styles.container}
            // keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 90} 
            keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 80} 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
        >
            <View style={{flex: 1,alignItems:"center", marginTop: 40}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L}}>Enter OTP code sent to</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.L,marginBottom: 20,}}>{mobile}</Text>

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
                         {
                            errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,color: COLOR.RED,marginHorizontal: 16}}>{errorMessage}</Text>
                        }
                        <TouchableOpacity
                                disabled={otpTimer > 0 ? true : false}
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={CreateVerificationCode}
                        >
                                <Text style={{opacity: otpTimer > 0 ? 0.7 : 1,color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Didn't get code? Tap here to resend.</Text>
                                { otpTimer > 0 && <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{otpTimer} s</Text> }
                        </TouchableOpacity>
            </View>
            <View style={{height: SIZE.FORM_HEIGHT + 16}}> 
            {
                pinCode.length < 6 || getOtpLoading
                ? <DisabledButton label="Proceed"/>
                : <YellowButton onPress={ConfirmVerificationCode} label="Proceed"/>
            }   
            </View>
            <BuildingBottom/>
        </KeyboardAvoidingView>
        </CheckIdleState>
        </FlagSecureScreen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white",
        padding: 16,
    },
    bottomActions: {
        flexDirection: "row",
        width:"100%",
        height: 50,
        padding: 16,
    },
})
