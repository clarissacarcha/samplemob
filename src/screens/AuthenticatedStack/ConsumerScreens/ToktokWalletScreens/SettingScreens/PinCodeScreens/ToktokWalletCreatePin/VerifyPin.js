import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView} from 'react-native'
import {COLOR, FONT, FONT_SIZE} from '../../../../../../../res/variables'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from '../../../../../../../graphql';
import { VERIFY_PIN_CODE } from '../../../../../../../graphql/toktokwallet';
import {useLazyQuery} from '@apollo/react-hooks'
import {onError, onErrorAlert} from '../../../../../../../util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'
import {DisabledButton, NumberBoxes} from '../../../Components'
import { YellowButton } from '../../../../../../../revamp';
import { useAlert } from '../../../../../../../hooks';
import { Alert } from 'react-native';

const VerifyPin = ({pageIndex,setPageIndex})=> {

    const [showPin,setShowPin] = useState(false)
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const navigation = useNavigation()
    const alert = useAlert()

    const [pinCodeAttempts,setPinCodeAttempts] = useState({
        visible: false,
        attempts: "",
    })

    const [verifyPinCode, {data ,error , loading }] = useLazyQuery(VERIFY_PIN_CODE, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({verifyPinCode})=>{
            if(verifyPinCode.result == 1){
                setPinCodeAttempts({
                    visible: false,
                    attempts: ''
                })
                setPageIndex(state=>state+1)
            }else{
            
                if(verifyPinCode.remainingAttempts == 0){
                    navigation.navigate("ToktokWalletHomePage")
                    navigation.replace("ToktokWalletHomePage")
                    return navigation.push("ToktokWalletRestricted", {component: "onHold"})
                }

                setPinCodeAttempts({
                    visible: true,
                    attempts: verifyPinCode.remainingAttempts
                })
            }
        },
        onError: (error)=> {
            onErrorAlert({alert, error})
        }
    })

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };
    
    const onSubmit = ()=> {
        verifyPinCode({
            variables: {
                input: {
                    pinCode: pinCode
                }
            }
        })
    }

    const forgotPIN = ()=>{
        navigation.navigate("ToktokWalletRecoveryMethods")
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 20,alignSelf:"center"}}>Enter old PIN</Text>
                    <View style={{position: 'relative',marginTop: 50,}}>
                        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin}/>
                        <TextInput
                            caretHidden
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 6) {
                                const num = value.replace(/[^0-9]/g, '')
                                setPinCode(num);
                            }
                            }}
                            onSubmitEditing={onSubmit}
                        />
                         {
                            pinCodeAttempts.visible && <Text style={{fontFamily: FONT.REGULAR,color:"red",alignSelf:"center",fontSize: 12}}>Invalid PIN , You can try {pinCodeAttempts.attempts} more times</Text>
                        }

                        <TouchableOpacity
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={forgotPIN}
                        >
                                <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>Forgot PIN?</Text>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
            <View style={{padding: 16}}>
                {
                    pinCode.length < 6
                    ? <DisabledButton label="Next"/>
                    : <YellowButton label="Next" onPress={onSubmit}/>
                }
            </View>
          
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
        padding: 10,
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
        paddingHorizontal: 10,
        fontSize: 25,
        width: 30,
    },
})

export default VerifyPin