import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,ScrollView,Image,Dimensions} from 'react-native'
import { YellowButton } from 'src/revamp'
import {DisabledButton, NumberBoxes,BuildingBottom} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS
const {width,height} = Dimensions.get("window")

export const CreatePin = ({pinCode,setPinCode,pageIndex,setPageIndex,tokwaAccount})=> {

    const [newPinCode,setNewPinCode] = useState("")
    const [showPin,setShowPin] = useState(false)
    const inputRef = useRef();
    const [errorMessage,setErrorMessage] = useState("")

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };
    
    const onSubmit = () => {
       let isWeakPin = true
       for(let x = 0 ; x < newPinCode.length ; x++){
           if(newPinCode[0] != newPinCode[x]){
            isWeakPin = false
            break
           }
       }
       if(isWeakPin) {
        setShowPin(true)
        return setErrorMessage(`Your TPIN must not contain repeating digits ex. 000000`)
       }
       setPageIndex(oldstate=>oldstate+1);
       setPinCode(newPinCode);
    };

    useEffect(()=>{
        setErrorMessage("")
    },[newPinCode])


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                { !tokwaAccount.pinCode && (
                    <Text style={{ textAlign: "center", fontSize: FONT_SIZE.S, marginVertical: 40, marginHorizontal: 20 }}>
                        You will use your TPIN in every transaction you make with toktokwallet. Please keep it to yourself and do not share with anyone.
                    </Text>
                )}
                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 20,alignSelf:"center"}}>Setup {tokwaAccount.pinCode ? "New ": ""}TPIN</Text>
                <View style={{position: 'relative',marginTop: 20,}}>
                    <NumberBoxes pinCode={newPinCode} onNumPress={onNumPress} showPin={showPin}/>
                    <TextInput
                        caretHidden
                        value={newPinCode}
                        ref={inputRef}
                        style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        onChangeText={(value) => {
                        if (value.length <= 6) {
                            const num = value.replace(/[^0-9]/g, '')
                            setNewPinCode(num);
                        }
                        }}
                        onSubmitEditing={newPinCode.length == 6 ? onSubmit: null}
                    />

                    {
                        errorMessage != "" &&  <Text style={{fontFamily: FONT.REGULAR,fontSize: 12,color:COLOR.RED,alignSelf:"center"}}>{errorMessage}</Text>   
                    }


                    <TouchableOpacity
                        style={{marginTop: height * .07,paddingVertical: 10,alignItems: "center"}}
                        onPress={()=>setShowPin(!showPin)}
                    >
                        <Text style={{color: COLOR.ORANGE,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{showPin ? "Hide TPIN" : "Show TPIN"}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
             <View style={{padding: 16}}>
                {
                    newPinCode.length < 6
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
