import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Dimensions,Image} from 'react-native'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { VERIFY_PIN_CODE } from 'toktokwallet/graphql';
import {useLazyQuery} from '@apollo/react-hooks'
import {onError, onErrorAlert} from 'src/util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'
import {BuildingBottom, DisabledButton, NumberBoxes} from 'toktokwallet/components'
import { YellowButton } from 'src/revamp';
import { useAlert } from 'src/hooks';
import { AlertOverlay } from 'src/components';
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS
const {width,height} = Dimensions.get("window")

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

export const VerifyPin = ({pageIndex,setPageIndex})=> {

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
        navigation.navigate("ToktokWalletRecoveryMethods" , {type: "TPIN"})
    }

    return (
        <>
         <AlertOverlay visible={loading} />
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 20,alignSelf:"center"}}>Enter old TPIN</Text>
                    <View style={{position: 'relative',marginTop: 40,padding: 16,}}>
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
                            onSubmitEditing={pinCode.length == 6 ? onSubmit: null}
                        />
                         {
                            pinCodeAttempts.visible && <Text style={{fontFamily: FONT.REGULAR,color:"red",alignSelf:"center",fontSize: 12,textAlign:'center'}}>Incorrect TPIN. You can try {numWordArray[pinCodeAttempts.attempts]} ({pinCodeAttempts.attempts}) more {pinCodeAttempts.attempts == 1 ? "time" : "times"} before your account will be temporarily blocked.</Text>
                        }

                        <TouchableOpacity
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={()=>setShowPin(!showPin)}
                        >
                                <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>{showPin ? "HIDE TPIN" : "SHOW TPIN"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                                style={{paddingVertical: 10,alignItems: "center"}}
                                onPress={forgotPIN}
                        >
                                <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD}}>FORGOT TPIN?</Text>
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
            <BuildingBottom/>
          
       </View>
       </>
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