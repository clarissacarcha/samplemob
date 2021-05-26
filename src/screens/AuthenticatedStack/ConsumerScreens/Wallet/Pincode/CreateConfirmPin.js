import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,Alert,ScrollView} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_REGULAR, SIZES} from '../../../../../res/constants'
import NumberBoxes from './Components/NumberBoxes'

const ConfirmPin = ({pinCode,setPageIndex,walletinfo,patchPincodeToktokWallet})=> {


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
           return Alert.alert("","Pin code does not match!")
        }
    };

    useEffect(()=>{
        if(confirmpinCode.length == 6){
            if(pinCode != confirmpinCode){
                return setMessage("Pin code does not match! Please try again")
            }
            return patchPincodeToktokWallet()
        }else{
            return setMessage("")
        }
    },[confirmpinCode])

    return (
       <View style={styles.container}>
            <ScrollView style={styles.content}>
                    <Text style={{fontSize: SIZES.M,fontFamily: FONT_MEDIUM,marginTop: 20,alignSelf:"center"}}>Confirm your PIN</Text>
                    <View style={{position: 'relative',marginTop: 50,}}>
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
                                setConfirmPinCode(value);
                            }
                            }}
                            onSubmitEditing={onSubmit}
                        />

                        {
                            message != "" &&  <Text style={{fontFamily: FONT_REGULAR,fontSize: 12,color:"red",alignSelf:"center"}}>{message}</Text>   
                        }

                            <TouchableOpacity
                                    style={{marginTop: 40,paddingVertical: 10, alignItems: "center"}}
                                    onPress={()=>setShowPin(!showPin)}
                            >
                                    <Text style={{color: "#F6841F",fontSize:SIZES.S,fontFamily: FONT_MEDIUM}}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
                            </TouchableOpacity>

                      
                    </View>
            </ScrollView>
       </View>
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
        color: DARK,
        width: 30,
    },
})

export default ConfirmPin