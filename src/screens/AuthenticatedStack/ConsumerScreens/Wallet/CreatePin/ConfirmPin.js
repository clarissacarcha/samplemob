import React, { useState ,useRef } from 'react'
import {View,Text,StyleSheet,TouchableHighlight,TouchableOpacity,TextInput,Alert} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM} from '../../../../../res/constants'
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


const ConfirmPin = ({navigation,route})=> {


    navigation.setOptions({
        headerLeft: ()=> <HeaderBack/>,
        headerTitle: ()=> <HeaderTitle label={['Set up a PIN','']}/>,
    })

    const {pinCode} = route.params
    const [confirmpinCode,setConfirmPinCode] = useState("")
    const [showPin,setShowPin] = useState(false)
    const inputRef = useRef();

    const onNumPress = () => {
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
    };
    
    const onSubmit = () => {
        if(pinCode != confirmpinCode){
            Alert.alert("Pin code does not match!")
        }else {
            navigation.navigate("TokTokWalletSettingsConfirmEmail", {pinCode: pinCode})
        }
    };

    return (
       <View style={styles.container}>
            <View style={styles.content}>
                    <Text style={{fontSize: 14,fontFamily: FONT_MEDIUM,marginTop: 20,}}>Confirm your PIN</Text>
                    <View style={{position: 'relative',marginTop: 50,}}>
                        <NumberBoxes pinCode={confirmpinCode} onNumPress={onNumPress} showPin={showPin}/>
                        <TextInput
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

                        <TouchableOpacity
                                style={{marginTop: 20,alignItems: "center"}}
                                onPress={()=>setShowPin(!showPin)}
                        >
                                <Text style={{color: "#F6841F",fontSize: 12,fontFamily: FONT_MEDIUM}}>{showPin ? "HIDE PIN" : "SHOW PIN"}</Text>
                        </TouchableOpacity>
                    </View>
            </View>
            <TouchableOpacity
                onPress={onSubmit}
                style={{alignItems: "center",height: 40,backgroundColor: DARK,margin: 20,justifyContent: "center",borderRadius: 10,}}
            >
                    <Text style={{color: COLOR,fontSize: 12,fontFamily: FONT_MEDIUM}}>Confirm</Text>
            </TouchableOpacity>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
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
})

export default ConfirmPin