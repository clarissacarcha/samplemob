import React, {useState,useRef} from 'react'
import {View , Text , TextInput, StyleSheet , Modal , KeyboardAvoidingView, Platform, Dimensions , TouchableHighlight, TouchableOpacity} from 'react-native'
import CONSTANTS from 'common/res/constants'
import { ICON_SET, VectorIcon, YellowButton } from 'src/revamp'
import { DisabledButton } from '../DisabledButton'
import { BuildingBottom } from '../BuildingBottom'

const {width,height} = Dimensions.get("window")
const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS

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

export const EnterPinCode = ({
    visible,
    setVisible,
    loading,
    pinCodeAttempt,
    callBackFunc,
    children
})=> {

    const [pinCode,setPinCode] = useState("")
    const inputRef = useRef();
    const [showPin,setShowPin] = useState(false)

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };
    

    return (
        <>
        <Modal
            visible={visible}
            onRequestClose={()=>{
                setPinCode("")
                setVisible(false)
            }}
            transparent={false}
            style={styles.container}
        >
            {children}
            {/* <AlertOverlay loading={loading}/> */}
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
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L}}>Enter your TPIN</Text>
                        <View style={{marginTop: 30,flexDirection:"row"}}>
                            <NumberBoxes pinCode={pinCode} onNumPress={onNumPress} showPin={showPin}/>
                            <TextInput
                                caretHidden
                                value={pinCode}
                                ref={inputRef}
                                style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                                keyboardType="numeric"
                                returnKeyType="done"
                                onChangeText={(value) => {
                                if (value.length <= 6) {
                                    setPinCode(value);
                                }
                                }}
                               
                            />
                        </View>
                            {
                                pinCodeAttempt < 6 && <Text style={{fontFamily: FONT.REGULAR,color:"red",alignSelf:"center",fontSize: 12,textAlign:'center'}}>Incorrect TPIN. You can try {numWordArray[pinCodeAttempt]} ({pinCodeAttempt}) more {pinCodeAttempt == 1 ? "time" : "times"} before your account will be temporarily suspended.</Text>
                            }
                            <TouchableOpacity
                                    style={{marginTop: 18,paddingVertical: 10, alignItems: "center"}}
                                    onPress={()=>setShowPin(!showPin)}
                            >
                                    <Text style={{color: COLOR.ORANGE,fontSize:FONT_SIZE.M,fontFamily: FONT.BOLD}}>{showPin ? "HIDE TPIN" : "SHOW TPIN"}</Text>
                            </TouchableOpacity>
                        </View>
                   
                    </View>
                    <View style={styles.proceedBtn}>
                            {
                                pinCode.length < 6
                                ? <DisabledButton label="Proceed" />
                                : <YellowButton label="Proceed" onPress={()=>{
                                    // setPinCode("")
                                    callBackFunc({pinCode})
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

