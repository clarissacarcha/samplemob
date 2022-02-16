import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,Alert,ScrollView,Dimensions,Image} from 'react-native'
import {NumberBoxes,BuildingBottom} from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR } = CONSTANTS
const {width,height} = Dimensions.get("window")

export const CreateConfirmPin = ({pinCode,setPageIndex,walletinfo,patchPincodeToktokWallet,tokwaAccount})=> {


    const [confirmpinCode,setConfirmPinCode] = useState("")
    const [showPin,setShowPin] = useState(false)
    const [message,setMessage] = useState("")
    const inputRef = useRef();

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };
    
    const onSubmit = () => {
        if(pinCode != confirmpinCode){
           return Alert.alert("","TPIN code does not match!")
        }
    };

    useEffect(()=>{
        if(confirmpinCode.length == 6){
            if(pinCode != confirmpinCode){
                return setMessage("TPIN code does not match! Please try again")
            }
            return patchPincodeToktokWallet()
        }else{
            return setMessage("")
        }
    },[confirmpinCode])

    return (
       <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                { !tokwaAccount.pinCode && (
                    <Text style={{ textAlign: "center", fontSize: FONT_SIZE.S, marginVertical: 40, marginHorizontal: 20 }}>
                        You will use your TPIN in every transaction you make with toktokwallet. Please keep it to yourself and do not share with anyone.
                    </Text>
                )}
                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 20,alignSelf:"center"}}>Confirm {tokwaAccount.pinCode ? "New ": ""}TPIN</Text>
                <View style={{position: 'relative',marginTop: 20,}}>
                    <NumberBoxes pinCode={confirmpinCode} onNumPress={onNumPress} showPin={showPin}/>
                    <TextInput
                        autoFocus={true}
                        caretHidden
                        value={confirmpinCode}
                        ref={inputRef}
                        style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent'}}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        onChangeText={(value) => {
                        if (value.length <= 6) {
                            const num = value.replace(/[^0-9]/g, '')
                            setConfirmPinCode(num);
                        }
                        }}
                        onSubmitEditing={onSubmit}
                    />
                    {
                        message != "" &&  <Text style={{fontFamily: FONT.REGULAR,fontSize: 12,color:"red",alignSelf:"center"}}>{message}</Text>   
                    }
                    <TouchableOpacity
                        style={{marginTop: height * .07,paddingVertical: 10, alignItems: "center"}}
                        onPress={()=>setShowPin(!showPin)}
                    >
                        <Text style={{color: COLOR.ORANGE,fontSize:FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{showPin ? "Hide TPIN" : "Show TPIN"}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{padding: 16}}>
                <View style={{height: 50}}/>
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
