import React, { useState ,useRef , useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Dimensions
} from 'react-native'
import { YellowButton } from 'src/revamp'
import {DisabledButton, NumberBoxes,BuildingBottom} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS
const {width,height} = Dimensions.get("window")

export const Create = ({pinCode,setPinCode,pageIndex,setPageIndex,tokwaAccount})=> {

    const [newPinCode, setNewPinCode] = useState("")
    const [showPin,setShowPin] = useState(false)
    const inputRef = useRef();
    const [errorMessage,setErrorMessage] = useState("")

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };

    const checkfIfSequential = (newPinCode)=> {
        let isPinSequential = false;
        let a = +newPinCode[1] - +newPinCode[0];
        let b = +newPinCode[2] - +newPinCode[1];
        let c = +newPinCode[3] - +newPinCode[2];
        // if(a == 1 && b == 1 && c == 1){
        //     isPinSequential = true
        // }
        if(a == b && b == c && c == a){
            isPinSequential = true
        }
        return isPinSequential;
    }
    
    const onSubmit = () => {
       let isWeakPin = true
       for(let x = 0 ; x < newPinCode.length ; x++){
           if(newPinCode[0] != newPinCode[x]){
            isWeakPin = false
            break
           }
       }
       if(isWeakPin || checkfIfSequential(newPinCode)) {
        setShowPin(true)
        return setErrorMessage(`Your MPIN must not contain ${isWeakPin ? 'repeating' : 'sequential'} digits ex. ${isWeakPin ? '0000' : '1234'}`)
       }
       setPageIndex(oldstate=>oldstate+1)
       setPinCode(newPinCode)
    };

    useEffect(()=>{
        setErrorMessage("")
    },[newPinCode])

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                { !tokwaAccount.mpinCode && (
                    <Text style={{marginVertical: 20, marginHorizontal: 10 ,textAlign:"center",fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}>
                        ka-toktok, do not forget your MPIN, keep it to yourself and do not share this with anyone.
                    </Text>
                )}
                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 20,alignSelf:"center"}}>Setup {tokwaAccount.mpinCode ? "New ": ""}MPIN</Text>
                <View style={{position: 'relative', marginTop: 20}}>
                    <NumberBoxes pinCode={newPinCode} onNumPress={onNumPress} showPin={showPin} numberOfBox={4}/>
                    <TextInput
                        caretHidden
                        value={newPinCode}
                        ref={inputRef}
                        style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        onChangeText={(value) => {
                        if (value.length <= 4) {
                            const num = value.replace(/[^0-9]/g, '')
                            setNewPinCode(num);
                        }
                        }}
                        onSubmitEditing={newPinCode.length == 4 ? onSubmit: null}
                    />

                    {
                        errorMessage != "" &&  <Text style={{fontFamily: FONT.REGULAR,fontSize: 12,color:COLOR.RED,alignSelf:"center"}}>{errorMessage}</Text>   
                    }


                    <TouchableOpacity
                        style={{marginTop: height * .07, paddingVertical: 10, alignItems: "center"}}
                        onPress={()=>setShowPin(!showPin)}
                    >
                        <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{showPin ? "Hide MPIN" : "Show MPIN"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
             <View style={{padding: 16}}>
                {
                    newPinCode.length < 4
                    ? <DisabledButton label="Next"/>
                    : <YellowButton label="Next" onPress={onSubmit}/>
                }
            </View>
           <BuildingBottom/>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        padding: 16,
        flex: 1,
        justifyContent: "center"
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
