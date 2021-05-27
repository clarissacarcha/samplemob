import React , {useState,useRef} from 'react'
import { Alert } from 'react-native'
import {View,Text,StyleSheet,Platform,KeyboardAvoidingView,TextInput,TouchableOpacity} from 'react-native'
import { COLOR, FONT, FONT_SIZE, SIZE } from '../../../../../res/variables'
import { HeaderBack, HeaderTitle, YellowButton } from '../../../../../revamp'
import { DisabledButton, NumberBoxes, Separator } from '../Components'
import { PATCH_LINK_TOKWA_ACCOUNT} from '../../../../../graphql/toktokwallet'
import { useMutation } from '@apollo/react-hooks'

const ToktokWalletLinkAccount = ({navigation, route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[""]}/>
    })

    const tokwaAccount = route.params.tokwaAccount
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();


    const [patchLinkTokwaAccount , {data,error,loading}] = useMutation(PATCH_LINK_TOKWA_ACCOUNT, {
        onCompleted: ({patchLinkTokwaAccount})=>{
            return navigation.navigate("ToktokWalletHomePage")
        },
        onError: (error)=>{
            console.log(error)
        }
    })

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };


    const CreateVerificationCode = ()=> {

    }

    const ConfirmVerificationCode = ()=> {
        if(pinCode == "123456"){
            patchLinkTokwaAccount({
                variables: {
                    input: {
                        tokwaAccountId: tokwaAccount.id
                    }
                }
            })
        }else{
            Alert.alert("","Invalid verification code")
        }
    }

    return (
        <>
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