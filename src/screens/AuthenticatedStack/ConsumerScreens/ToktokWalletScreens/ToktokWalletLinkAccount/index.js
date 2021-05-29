import React , {useState,useRef,useEffect} from 'react'
import { Alert } from 'react-native'
import {View,Text,StyleSheet,Platform,KeyboardAvoidingView,TextInput,TouchableOpacity} from 'react-native'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../res/variables'
import { HeaderBack, HeaderTitle, YellowButton } from '../../../../../revamp'
import { DisabledButton, NumberBoxes, Separator } from '../Components'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT } from '../../../../../graphql/'
import { PATCH_LINK_TOKWA_ACCOUNT , GET_LINK_ACCOUNT_OTP , VERIFY_LINK_ACCOUNT_OTP } from '../../../../../graphql/toktokwallet'
import { useMutation , useLazyQuery } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../hooks'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal'

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

    const [getLinkAccountOTP] = useLazyQuery(GET_LINK_ACCOUNT_OTP, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        onCompleted: ({getLinkAccountOTP})=> {
            console.log(getLinkAccountOTP)
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
                        tokwaAccountId: tokwaAccount.id
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

    return (
        <>
        <SuccessfulModal visible={successModalVisible} setVisible={setSuccessModalVisible}/>
        <Separator/>
        <View 
            style={styles.container}
        >

            <View style={{flex: 1,alignItems:"center"}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L}}>Enter verification code sent to</Text>
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
                    {/* <View style={{width:"100%",marginTop: 20}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Didn't receive it?</Text>
                        <TouchableOpacity onPress={CreateVerificationCode}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Request a new code</Text>
                        </TouchableOpacity>
                    </View> */}
            </View>
            <View style={{height: SIZE.BUTTON_HEIGHT}}> 
            {
                pinCode.length < 6
                ? <DisabledButton label="Proceed"/>
                : <YellowButton onPress={ConfirmVerificationCode} label="Proceed"/>
            }   
            </View>


        </View>
        {/* <Text>{JSON.stringify(tokwaAccount)}</Text> */}
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