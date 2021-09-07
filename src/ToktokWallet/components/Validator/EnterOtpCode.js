import React, {useState,useRef} from 'react'
import {View , Text , TextInput, StyleSheet , Modal , KeyboardAvoidingView, Platform, Dimensions , TouchableHighlight, TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'
import { ICON_SET, VectorIcon, YellowButton } from 'src/revamp'
import { useAccount } from 'toktokwallet/hooks'
import { DisabledButton } from '../DisabledButton'
import { BuildingBottom } from '../BuildingBottom'

const {width,height} = Dimensions.get("window")
const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS


const NumberBox = ({onPress,value, showPin}) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR.YELLOW} style={{borderRadius: 10,marginHorizontal: 5,}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 25, fontFamily: FONT.BOLD}}>{value ? showPin ? value : "•" : ''}</Text>
      </View>
    </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress , showPin}) => {

    const numberBoxes = [];
    var i;
    for (i = 0; i <= 5; i++) {
      numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} showPin={showPin}/>);
    }
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
            {numberBoxes}
        </View>
    );
 };

 export const EnterOtpCode = ({
    visible,
    setVisible,
    callBackFunc,
    children
 })=> { 
    const {tokwaAccount} = useAccount();
    const [otpCode,setOtpCode] = useState("")
    const inputRef = useRef();

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };

    return(
        <>
        <Modal
            visible={visible}
            onRequestClose={()=>{
                setOtpCode("")
                setVisible(false)
            }}
            transparent={false}
            style={styles.container}
        >
            {children}
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 30} 
                style={styles.modalBody}
            >
                <View style={styles.content}>
                <TouchableOpacity onPress={()=>setVisible(false)} style={styles.backBtn}>
                    <VectorIcon iconSet={ICON_SET.Feather} name="chevron-left" size={20} color="#222222" />
                </TouchableOpacity>
                        <View style={styles.pincodeContent}>
                            <View style={{marginTop: 165, height: 200,width:width,alignItems:"center",paddingHorizontal: 16,}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L}}>Enter OTP code sent to</Text>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.L,marginBottom: 20,}}>{tokwaAccount.mobileNumber}</Text>
                            <View style={{marginTop: 30,flexDirection:"row"}}>
                            <NumberBoxes pinCode={otpCode} onNumPress={onNumPress} showPin={true}/>
                            <TextInput
                                caretHidden
                                value={otpCode}
                                ref={inputRef}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                                keyboardType="numeric"
                                returnKeyType="done"
                                onChangeText={(value) => {
                                if (value.length <= 6) {
                                    setOtpCode(value);
                                }
                                }}
                               
                            />
                        </View>
                             </View>

                         </View>

                         <View style={styles.proceedBtn}>
                                {
                                    otpCode.length < 6
                                    ? <DisabledButton label="Proceed" />
                                    : <YellowButton label="Proceed" onPress={()=>{
                                        setOtpCode("")
                                        callBackFunc({Otp: otpCode})
                                    }} />
                                }
                        </View>
                </View>
                <BuildingBottom/>
            </KeyboardAvoidingView>

          
        </Modal>
        </>
    )
 }

 const styles = StyleSheet.create({
     container: {
         flex: 1,
     },
     modalBody: {
        flex: 1,
        backgroundColor:"white"
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
        width: 30,
    },
    proceedBtn: {
        height: 70,
        width: "100%",
        padding: 16,
        justifyContent:"flex-end"
    },
    backBtn: {
        backgroundColor:"#F7F7FA",
        top: Platform.OS == "ios" ? 40 : 10, 
        left: 16,
        position:"absolute",
        zIndex: 1,
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 100,
        height: 35,
        width: 35,
    }
 })