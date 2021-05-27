import React , {useState,useRef,useEffect} from 'react'
import {View,Text,StyleSheet,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform} from 'react-native'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../../res/variables'
import { HeaderBack, HeaderTitle, ICON_SET, VectorIcon, YellowButton } from '../../../../../../revamp'
import { DisabledButton, NumberBoxes, Separator } from '../../Components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql'
import { GET_LINK_VERIFICATION_CODE , PATCH_LINK_ACCOUNT } from '../../../../../../graphql/toktokwallet'
import { useLazyQuery , useMutation } from '@apollo/react-hooks'
import { onErrorAlert } from '../../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../../hooks/useAlert'

//SELF IMPORTS
import SuccessfulModal from "./SuccessfulModal";



const ToktokWalletGcashLinKAccount = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[""]}/>
    })

    const { mobile , provider } = route.params
    const [pinCode,setPinCode] = useState("")
    const [modalSuccessVisible,setModalSuccessVisible] = useState(false)
    const inputRef = useRef();
    const alert = useAlert()

    const [getLinkVerificationCode] = useLazyQuery(GET_LINK_VERIFICATION_CODE,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: ({getLinkVerificationCode})=>{
            console.log(getLinkVerificationCode)
        },
        onError: (error)=>{
            onErrorAlert({alert,error})
        }
    })

    const [patchLinkAccount, {date,error,loading}] = useMutation(PATCH_LINK_ACCOUNT,{
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({patchLinkAccount})=>{
            setModalSuccessVisible(true)
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
        getLinkVerificationCode({
            variables: {
                input: {
                    mobile: mobile
                }
            }
        })
    }

    const ConfirmVerificationCode = ()=> {
        return patchLinkAccount({
            variables: {
                input: {
                    verificationCode: pinCode,
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

    return (
        <>
        <Separator/>
        <SuccessfulModal visible={modalSuccessVisible} setVisible={setModalSuccessVisible} provider={provider}/>
        <KeyboardAvoidingView 
            style={styles.container}
            keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 90} 
            // keyboardVerticalOffset={90} 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
        >
            <View style={{flex: 1,alignItems:"center"}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L}}>Enter verification code sent to</Text>
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
                     <View style={{width:"100%",marginTop: 20}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Didn't receive it?</Text>
                        <TouchableOpacity onPress={CreateVerificationCode}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Request a new code</Text>
                        </TouchableOpacity>
                    </View>
            </View>
            <View style={{height: SIZE.BUTTON_HEIGHT}}> 
            {
                pinCode.length < 6
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