import React, { useState ,useRef , useEffect } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,Alert,ScrollView} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_REGULAR} from '../../../../../res/constants'
import {HeaderBack, HeaderTitle} from '../../../../../components'


const NumberBox = ({onPress, value , showPin}) => (
    <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={{borderRadius: 10,marginHorizontal: 5,}}>
      <View style={styles.inputView}>
        <Text style={{fontSize: 25}}>{value ? showPin ? value : "*" : '_'}</Text>
      </View>
    </TouchableHighlight>
);

const NumberBoxes = ({pinCode, onNumPress, showPin}) => {

    const numberBoxes = [];
    var i;
    for (i = 0; i <= 3; i++) {
      numberBoxes.push(<NumberBox onPress={onNumPress} value={pinCode[i]} showPin={showPin}/>);
    }
    return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20}}>
            {numberBoxes}
        </View>
    );
  };


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
        if(confirmpinCode.length == 4){
            if(pinCode != confirmpinCode){
                return setMessage("Pin code does not match! Please try again")
            }
            if(walletinfo.pincode == null){
                return setPageIndex(oldstate=>oldstate+1)
            }
            return patchPincodeToktokWallet()
        }else{
            return setMessage("")
        }
    },[confirmpinCode])

    return (
       <View style={styles.container}>
            <ScrollView style={styles.content}>
                    <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM,marginTop: 20,alignSelf:"center"}}>Confirm your PIN</Text>
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
                            if (value.length <= 4) {
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
                                    <Text style={{color: "#F6841F",fontSize: 12,fontFamily: FONT_MEDIUM}}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
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
})

export default ConfirmPin