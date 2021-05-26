import React , {useState,useRef , useEffect} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,TextInput,TouchableHighlight,Image,KeyboardAvoidingView,Platform} from 'react-native'
import { COLOR, DARK, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants';
import {GET_VERIFY_TOKTOK_WALLET_PIN} from '../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import {onError} from '../../../../../util/ErrorUtility'

const NumberBox = ({onPress,value}) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5,}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 25}}>{value ? "*" : "_"}</Text>
      </View>
    </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress}) => {

    const numberBoxes = [];
    var i;
    for (i = 0; i <= 5; i++) {
      numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]}/>);
    }
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
            {numberBoxes}
        </View>
    );
 };

const PincodeSecurity = ({navigation,route})=> {

    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();

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
                    navigation.navigate("ToktokWalletHomePage")
                    return navigation.replace("ToktokWalletHomePage",{isHold: true})
                }

                return setPinCodeAttempts({
                    visible: true,
                    attempts: response.getVerifyToktokWalletPIN.attempts
                })
            }   

            setPinCodeAttempts({
                visible: false,
                attempts: response.getVerifyToktokWalletPIN.attempts
            })

            route.params.onConfirm()
            setTimeout(()=>{
                setPinCode("")
            },2000)
        }
    })

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };
    
    const onSubmit = () => {
       getVerifyToktokWalletPIN({
            variables: {
                input: {
                    pincode: pinCode
                }
            },
       })
    };

    useEffect(()=>{
        if(pinCode.length == 6){
            getVerifyToktokWalletPIN({
                variables: {
                    input: {
                        pincode: pinCode
                    }
                },
           })
        }
    },[pinCode])


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.container}
        >

            <View style={styles.content}>
                <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
                    <Image style={{height: 100,width: 100}} source={require('../../../../../assets/icons/walletVerify.png')}/>
                    <Text style={{fontSize: SIZES.M,fontFamily: FONT_MEDIUM,marginTop: 20,}}>Enter your PIN</Text>
                    <View style={{position: 'relative',marginTop: 50,}}>
                        <NumberBoxes pinCode={pinCode} onNumPress={onNumPress}/>
                        <TextInput
                            caretHidden
                            autoFocus={true}
                            value={pinCode}
                            ref={inputRef}
                            style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onChangeText={(value) => {
                            setPinCodeAttempts(oldstate=>({
                                ...oldstate,
                                visible: false
                            }))
                            if (value.length <= 6) {
                                setPinCode(value);
                            }
                            }}
                            //onSubmitEditing={onSubmit}
                        />
                        {
                            pinCodeAttempts.visible && <Text style={{fontFamily: FONT_REGULAR,color:"red",alignSelf:"center",fontSize: SIZES.S}}>Invalid PIN , You can try {pinCodeAttempts.attempts} more times</Text>
                        }
                    </View>
               </View>

{/*             
                <View style={styles.proceedBtn}>
                    <TouchableOpacity onPress={()=>{
                        setShowPinModal(false)
                    }} style={{height: "100%",flex: 1,marginRight: 5,backgroundColor: "transparent" ,borderColor: "gray", borderWidth: 1, borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_MEDIUM}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onSubmit} style={{height: "100%",flex: 1,marginLeft: 5,backgroundColor: DARK , borderRadius: 10, justifyContent: "center",alignItems: "center"}}>
                        <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Next</Text>
                    </TouchableOpacity>
                </View> */}

            </View>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        justifyContent:"center",
        alignItems: "center",
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
    proceedBtn: {
        height: 40,
        width: "100%",
        flexDirection: "row",
        marginTop: 100,
    },
})

export default PincodeSecurity