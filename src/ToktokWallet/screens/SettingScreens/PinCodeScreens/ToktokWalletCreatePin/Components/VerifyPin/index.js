import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Dimensions,Image} from 'react-native'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { VERIFY_PIN_CODE } from 'toktokwallet/graphql';
import {useLazyQuery} from '@apollo/react-hooks'
import {onError, onErrorAlert} from 'src/util/ErrorUtility'
import {useNavigation} from '@react-navigation/native'
import {BuildingBottom, DisabledButton, NumberBoxes} from 'toktokwallet/components'
import { YellowButton } from 'src/revamp';
import { useAlert, usePrompt } from 'src/hooks';
import { AlertOverlay } from 'src/components';
import CONSTANTS from 'common/res/constants'
import { TransactionUtility } from '../../../../../../util/TransactionUtility';

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

export const VerifyPin = ({pageIndex,setPageIndex,setOldTPIN})=> {

    const prompt = usePrompt()
    const [showPin,setShowPin] = useState(false)
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const navigation = useNavigation()
    const alert = useAlert()

    const [pinCodeAttempt, setPinCodeAttempt] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const [verifyPinCode, {data ,error , loading }] = useLazyQuery(VERIFY_PIN_CODE, {
        fetchPolicy: "network-only",
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({verifyPinCode})=>{
            setPageIndex(state=>state+1)
            setOldTPIN(pinCode)
        },
        onError: (error)=> {
            // onErrorAlert({alert, error})
            TransactionUtility.StandardErrorHandling({
                error,
                navigation,
                prompt,
                alert,
                setErrorMessage
            });
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
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 20,alignSelf:"center"}}>Enter Old TPIN</Text>
                <View style={{position: 'relative',marginTop: 20, }}>
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
                        !!errorMessage && <Text style={{fontFamily: FONT.REGULAR,color:"red",alignSelf:"center",fontSize: 12,textAlign:'center'}}>
                                {errorMessage}
                            </Text>
                    }

                    <TouchableOpacity
                        style={{marginTop: height * .07, paddingVertical: 10, alignItems: "center"}}
                        onPress={()=>setShowPin(!showPin)}
                    >
                        <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{showPin ? "Hide TPIN" : "Show TPIN"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{paddingVertical: height * .03,alignItems: "center"}}
                        onPress={forgotPIN}
                    >
                        <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>Forgot TPIN?</Text>
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
        justifyContent: "center",
        padding: 16,
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