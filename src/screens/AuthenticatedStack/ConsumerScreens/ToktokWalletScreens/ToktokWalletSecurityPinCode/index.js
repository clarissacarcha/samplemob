import React , {useState,useRef , useEffect} from 'react'
import {View,Text,Modal,StyleSheet,TouchableOpacity,TextInput,TouchableHighlight,Image,KeyboardAvoidingView,Platform,Dimensions} from 'react-native'
import { COLOR, COLORS, DARK, FONTS, FONT_MEDIUM, FONT_REGULAR, SIZES } from '../../../../../res/constants';
import {GET_VERIFY_TOKTOK_WALLET_PIN} from '../../../../../graphql'
import {useLazyQuery} from '@apollo/react-hooks'
import {useAlert} from '../../../../../hooks/useAlert'
import {onError,onErrorAlert} from '../../../../../util/ErrorUtility'
import { YellowButton } from '../../../../../revamp';

const {height,width} = Dimensions.get("window")

const NumberBox = ({onPress,value}) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5,}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 25}}>{value ? "*" : ""}</Text>
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

 export default ({navigation,route})=> {

    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const alert = useAlert()

    const [pinCodeAttempts,setPinCodeAttempts] = useState({
        visible: false,
        attempts: "",
    })

    const [getVerifyToktokWalletPIN, {data,error,loading}] = useLazyQuery(GET_VERIFY_TOKTOK_WALLET_PIN,{
        fetchPolicy: 'network-only',
        onError: (error)=> {
            return  onErrorAlert({alert,error})
        },
        onCompleted: (response)=> {
            console.log(response)
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
        // if(pinCode.length == 6){
        //     getVerifyToktokWalletPIN({
        //         variables: {
        //             input: {
        //                 pincode: pinCode
        //             }
        //         },
        //    })
        // }
    },[pinCode])


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 40}  
            style={styles.container}
        >

            <View style={styles.content}>
               <View style={styles.pincodeContent}>
                        <View style={{marginTop: 165, height: 200,width:width,alignItems:"center"}}>
                                <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.L,color: COLORS.DARK}}>Enter your pin</Text>
                                <View style={{marginTop: 30,flexDirection:"row"}}>
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
                                        onSubmitEditing={onSubmit}
                                    />
                                </View>
                                {
                                    pinCodeAttempts.visible && <Text style={{fontFamily: FONTS.REGULAR,color:"red",alignSelf:"center",fontSize: SIZES.M}}>Invalid PIN , You can try {pinCodeAttempts.attempts} more times</Text>
                                }
                        </View>
               </View>

            
                <View style={styles.proceedBtn}>
                  <YellowButton label="Proceed" onPress={onSubmit} />
                </View>

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
        flex: 1,
    },
    pincodeContent: {
        flex: 1,
    },
    inputView: {
        backgroundColor: '#F7F7FA',
        borderRadius: 5,
        height: 48,
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
        height: 70,
        width: "100%",
        padding: 16
    },
})

