import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Dimensions,Image} from 'react-native'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { GET_VERIFY_MPIN } from 'toktokwallet/graphql';
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
export const Verify = ({pageIndex,setPageIndex,setOldMPIN})=> {

    const navigation = useNavigation();
    const [showPin,setShowPin] = useState(false)
    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const [errorMessage,setErrorMessage] = useState("")
    const alert = useAlert()

    const [getVerifyMPIN , {data,error,loading}] = useLazyQuery(GET_VERIFY_MPIN, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        fetchPolicy:"network-only",
        onCompleted: ({getVerifyMPIN})=>{
            setErrorMessage("")
            setPageIndex(state=>state+1)
            setOldMPIN(pinCode)
        },
        onError: (error)=> {
            const {graphQLErrors, networkError} = error;
            if(graphQLErrors[0]?.message == "Account Blocked"){
                onErrorAlert({alert,error})
                // navigation.navigate("ToktokWalletLoginPage")
                // navigation.replace("ToktokWalletLoginPage")
                navigation.navigate("ToktokLandingHome")
                navigation.push("ToktokWalletLoginPage")  
                return
            }
            if(graphQLErrors[0]?.message == "Invalid MPincode"){
                const attempt = graphQLErrors[0].payload.remainingAttempts
                return setErrorMessage(`Incorrect MPIN. You can try ${numWordArray[attempt]} (${attempt}) more ${attempt == 1 ? 'time' : 'times'} before your account will be blocked.`)
            }

            onErrorAlert({alert,error})
            return navigation.pop()
        }
    })

    const onNumPress = ()=> {
        setTimeout(() => {
            inputRef.current.focus();
          }, 10);
    }

    const onPress = async ()=> {
   
        getVerifyMPIN({
            variables: {
                input: {
                    mpinCode: pinCode
                }
            }
        })
    }

    const forgotPIN = ()=> {
        navigation.navigate("ToktokWalletRecoveryMethods" , {type: "MPIN"})
    }


    return(
        <>
        <AlertOverlay visible={loading} />
        <View style={styles.container}>
            <ScrollView style={styles.content}>
            {/* <Text style={{marginVertical: 20, marginHorizontal: 10 ,textAlign:"center",fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>Ka-toktok, do not forget your MPIN, keep it to yourself and do not
share this with anyone</Text> */}
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 20,alignSelf:"center"}}>Enter Old MPIN</Text>
                    <View style={{position: 'relative',marginTop: 40,padding: 16,}}>
                    <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin} numberOfBox={4}/>
                        <TextInput
                            caretHidden
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            if (value.length <= 4) {
                                const num = value.replace(/[^0-9]/g, '')
                                setPinCode(num);
                            }
                            }}
                            onSubmitEditing={pinCode.length == 4 ? onPress: null}
                        />
                        {
                            errorMessage != "" &&  <Text style={{paddingHorizontal: 16,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:COLOR.RED,textAlign:"center"}}>{errorMessage}</Text>   
                        }

                        <TouchableOpacity
                                style={{marginTop: 18,paddingVertical: 10,alignItems: "center"}}
                                onPress={()=>setShowPin(!showPin)}
                        >
                                <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{showPin ? "HIDE MPIN" : "SHOW MPIN"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                                style={{paddingVertical: 10,alignItems: "center"}}
                                onPress={forgotPIN}
                        >
                                <Text style={{color: "#F6841F",fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>FORGOT MPIN?</Text>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
            <View style={{padding: 16}}>
                {
                    pinCode.length < 4
                    ? <DisabledButton label="Next"/>
                    : <YellowButton label="Next" onPress={onPress}/>
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