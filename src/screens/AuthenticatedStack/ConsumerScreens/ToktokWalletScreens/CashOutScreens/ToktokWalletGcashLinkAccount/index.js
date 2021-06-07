import React , {useState,useRef,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform} from 'react-native'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
import { HeaderBack, HeaderTitle, ICON_SET, VectorIcon, YellowButton } from '../../../../../../revamp'
import { DisabledButton, NumberBoxes, Separator } from '../../Components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import { PATCH_LINK_ACCOUNT , GET_GCASH_LINK_OTP } from '../../../../../../graphql/toktokwallet'
import { useLazyQuery , useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../../hooks/useAlert'

//SELF IMPORTS
import { AlertOverlay } from '../../../../../../components'



const ToktokWalletGcashLinKAccount = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[""]}/>
    })

    const { mobile , provider } = route.params
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const alert = useAlert()
    const [otpTimer,setOtpTimer] = useState(120)

    const [patchLinkAccount, {data,error,loading}] = useMutation(PATCH_LINK_ACCOUNT,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({patchLinkAccount})=>{
            navigation.navigate("ToktokWalletGcashHomePage", {provider})
            return navigation.replace("ToktokWalletGcashHomePage",{provider, successLink: true})
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
        }
    })

    const [getGcashLinkOTP, {loading: getOtpLoading}] = useLazyQuery(GET_GCASH_LINK_OTP, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({getGcashLinkOTP})=>{
            console.log(getGcashLinkOTP)
            setOtpTimer(120)
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
        }
    })

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };

    const CreateVerificationCode = ()=> {
        getGcashLinkOTP({
            variables: {
                input: {
                    mobileNumber: mobile
                }
            }
        })
    }

    const ConfirmVerificationCode = ()=> {
        return patchLinkAccount({
            variables: {
                input: {
                    OTPCode: pinCode,
                    mobile: mobile
                }
            }
        })
    }


    useEffect(()=>{
        CreateVerificationCode()
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
         <AlertOverlay visible={loading} />
        <Separator/>
        <KeyboardAvoidingView 
            style={styles.container}
            // keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 90} 
            keyboardVerticalOffset={60} 
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
                        <TouchableOpacity
                                disabled={otpTimer > 0 ? true : false}
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={CreateVerificationCode}
                        >
                                <Text style={{opacity: otpTimer > 0 ? 0.7 : 1,color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Didn't get code? Tap here to resend.</Text>
                                { otpTimer > 0 && <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{otpTimer} s</Text> }
                        </TouchableOpacity>
            </View>
            <View style={{height: SIZE.BUTTON_HEIGHT + 16}}> 
            {
                pinCode.length < 6 || getOtpLoading
                ? <DisabledButton label="Proceed"/>
                : <YellowButton onPress={ConfirmVerificationCode} label="Proceed"/>
            }   
            </View>
        </KeyboardAvoidingView>
        </>
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

export default ToktokWalletGcashLinKAccount