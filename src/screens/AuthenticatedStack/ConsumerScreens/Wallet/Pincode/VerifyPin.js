import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_REGULAR} from '../../../../../res/constants'
import { GET_VERIFY_TOKTOK_WALLET_PIN } from '../../../../../graphql';
import {useLazyQuery} from '@apollo/react-hooks'
import {onError} from '../../../../../util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'
import NumberBoxes from './Components/NumberBoxes'

const VerifyPin = ({pageIndex,setPageIndex})=> {

    const [showPin,setShowPin] = useState(false)
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const navigation = useNavigation()

    const [pinCodeAttempts,setPinCodeAttempts] = useState({
        visible: false,
        attempts: "",
    })

    const [getVerifyToktokWalletPIN, {data,error,loading}] = useLazyQuery(GET_VERIFY_TOKTOK_WALLET_PIN,{
        fetchPolicy: 'network-only',
        onError: onError,
        onCompleted: (response)=> {

            if(!response.getVerifyToktokWalletPIN.result){
                if(response.getVerifyToktokWalletPIN.attempts == 0) {
                    navigation.navigate("TokTokWallet")
                    return navigation.replace("TokTokWallet",{isHold: true})
                }

                return setPinCodeAttempts({
                    visible: true,
                    attempts: response.getVerifyToktokWalletPIN.attempts
                })
            }   

            return setPageIndex(oldstate=>oldstate+1)
        }
    })

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };
    
    const onSubmit = ()=> {
        getVerifyToktokWalletPIN({
            variables: {
                input: {
                    pincode: pinCode
                }
            },
        })
    }

    const forgotPIN = ()=>{
        navigation.navigate("TokToKWalletForgotPin")
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                    <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM,marginTop: 20,alignSelf:"center"}}>Enter old PIN</Text>
                    <View style={{position: 'relative',marginTop: 50,}}>
                        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin}/>
                        <TextInput
                            autoFocus={true}
                            caretHidden
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 6) {
                                setPinCode(value);
                            }
                            }}
                            onSubmitEditing={onSubmit}
                        />
                         {
                            pinCodeAttempts.visible && <Text style={{fontFamily: FONT_REGULAR,color:"red",alignSelf:"center",fontSize: 12}}>Invalid PIN , You can try {pinCodeAttempts.attempts} more times</Text>
                        }

                        <TouchableOpacity
                                style={{marginTop: 40,paddingVertical: 10,alignItems: "center"}}
                                onPress={forgotPIN}
                        >
                                <Text style={{color: "#F6841F",fontSize: 16,fontFamily: FONT_MEDIUM}}>Forgot PIN?</Text>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
            <TouchableOpacity
                disabled={pinCode.length < 6}
                onPress={onSubmit}
                style={{alignItems: "center",height: 40,backgroundColor: pinCode.length < 6 ? "gray" : DARK,margin: 20,justifyContent: "center",borderRadius: 10,}}
            >
                    <Text style={{color: pinCode.length < 6 ? "white" : COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Next</Text>
            </TouchableOpacity>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        // alignItems: "center",
        padding: 20,
        flex: 1,
    },
    inputView: {
        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        paddingHorizontal: 20,
        fontSize: 25,
        color: DARK,
        width: 30,
    },
})

export default VerifyPin