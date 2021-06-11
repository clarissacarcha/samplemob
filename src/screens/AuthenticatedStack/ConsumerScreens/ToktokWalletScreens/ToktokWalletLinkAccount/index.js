import React , {useState,useRef,useEffect} from 'react'
import { Alert } from 'react-native'
import {View,Text,StyleSheet,Platform,KeyboardAvoidingView,TextInput,TouchableOpacity,Image,Dimensions} from 'react-native'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../res/variables'
import { HeaderBack, HeaderTitle, YellowButton } from '../../../../../revamp'
import { DisabledButton, NumberBoxes, Separator , BuildingBottom} from '../Components'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../graphql/'
import { PATCH_LINK_TOKWA_ACCOUNT , GET_LINK_ACCOUNT_OTP , VERIFY_LINK_ACCOUNT_OTP } from '../../../../../graphql/toktokwallet'
import { useMutation , useLazyQuery } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../hooks'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'
import { AlertOverlay } from '../../../../../components'

const {height, width} = Dimensions.get("window")

const ToktokWalletLinkAccount = ({navigation, route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[""]}/>
    })

    const tokwaAccount = route.params.tokwaAccount
    const [pinCode,setPinCode] = useState("")
    const [successModalVisible,setSuccessModalVisible] = useState(false)
    const inputRef = useRef();
    const alert = useAlert()
    const [otpTimer,setOtpTimer] = useState(120)

    const [getLinkAccountOTP] = useLazyQuery(GET_LINK_ACCOUNT_OTP, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        onCompleted: ({getLinkAccountOTP})=> {
            console.log(getLinkAccountOTP)
            setOtpTimer(120)
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
        }
    })

    const [verifyLinkAccountOTP] = useLazyQuery(VERIFY_LINK_ACCOUNT_OTP, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        onCompleted: ({verifyLinkAccountOTP}) => {
            patchLinkTokwaAccount({
                variables: {
                    input: {
                        tokwaAccountId: tokwaAccount.id,
                        linkLimit: tokwaAccount.person.accountType.linkLimit,
                        firstName: tokwaAccount.person.firstName,
                        middleName: tokwaAccount.person.middleName,
                        lastName: tokwaAccount.person.lastName,
                        mobileNumber: tokwaAccount.mobileNumber,
                        emailAddress: tokwaAccount.person.emailAddress,
                        birthdate: tokwaAccount.person.birthdate,
                        selfieImage: tokwaAccount.person.selfieImage,
                    }
                }
            })
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
        }
    })


    const [patchLinkTokwaAccount , {data,error,loading}] = useMutation(PATCH_LINK_TOKWA_ACCOUNT, {
        onCompleted: ({patchLinkTokwaAccount})=>{
             // SUCCESSFUL MESSAGE THAT TOKWA ACCOUNT LINK HERE
             setSuccessModalVisible(true)
            //  navigation.pop()
            //  return navigation.replace("ToktokWalletHomePage")
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
        getLinkAccountOTP({
            variables: {
                input: {
                    mobileNumber: tokwaAccount.mobileNumber
                }
            }
        })
    }

    const ConfirmVerificationCode = ()=> {
        verifyLinkAccountOTP({
            variables: {
                input: {
                    OTPCode: pinCode,
                    mobileNumber: tokwaAccount.mobileNumber
                }
            }
        })
    }

    useEffect(()=>{
        CreateVerificationCode()
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
        <SuccessfulModal visible={successModalVisible} setVisible={setSuccessModalVisible}/>
        <Separator/>
        <KeyboardAvoidingView 
            keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 80}  
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.container}
        >

            <View style={{flex: 1,alignItems:"center",marginTop: 40}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L}}>Enter OTP code sent to</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.L,marginBottom: 20,}}>{tokwaAccount.mobileNumber}</Text>

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
                                <Text style={{opacity: otpTimer > 0 ? 0.7 : 1, color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Didn't get code? Tap here to resend.</Text>
                                { otpTimer > 0 && <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>{otpTimer} s</Text> }
                     </TouchableOpacity>
                   
            </View>
            <View style={{height: SIZE.BUTTON_HEIGHT + 16}}> 
            {
                pinCode.length < 6
                ? <DisabledButton label="Proceed"/>
                : <YellowButton onPress={ConfirmVerificationCode} label="Proceed"/>
            }   
            </View>
            <BuildingBottom/>

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

export default ToktokWalletLinkAccount