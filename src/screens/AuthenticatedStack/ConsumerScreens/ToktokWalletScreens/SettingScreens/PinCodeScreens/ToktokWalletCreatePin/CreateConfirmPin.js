import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,Alert,ScrollView,Dimensions,Image} from 'react-native'
import { FONT_SIZE, FONT, COLOR} from '../../../../../../../res/variables'
import {NumberBoxes,BuildingBottom} from '../../../Components'

const {width,height} = Dimensions.get("window")

const ConfirmPin = ({pinCode,setPageIndex,walletinfo,patchPincodeToktokWallet,tokwaAccount})=> {


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
                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.BOLD,marginTop: 20,alignSelf:"center"}}>Confirm your {tokwaAccount.pinCode ? "new ": ""}PIN</Text>
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
                                    style={{marginTop: 18,paddingVertical: 10, alignItems: "center"}}
                                    onPress={()=>setShowPin(!showPin)}
                            >
                                    <Text style={{color: COLOR.ORANGE,fontSize:FONT_SIZE.M,fontFamily: FONT.BOLD}}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
                            </TouchableOpacity>

                      
                    </View>
            </ScrollView>
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

export default ConfirmPin